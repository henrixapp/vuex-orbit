import { Schema } from '@orbit/data'
import VuexStore from './vuex-store'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from "vuex"
import { clone } from '@orbit/utils';
const localVue = createLocalVue()
localVue.use(Vuex)
// @ts-ignore
const schemaDefinition = {
    models: {
        pet: {
            attributes: {
                name: {
                    type: "string"
                }
            },
            relationships: {
                species: { type: 'hasOne', model: 'species', inverse: 'pets' }
            }
        },
        species: {
            attributes: {
                name: {
                    type: "string"
                }
            },
            relationships: {
                pets: { type: 'hasMany', model: 'pet', inverse: 'species' }
            }
        }
    }
}
// @ts-ignore
const schema = new Schema(schemaDefinition)

let vStore = new VuexStore({ schema })
let store = new Vuex.Store({
    modules: {
        vStore
    },
    strict: true,
    plugins: []
});
describe("simple example", () => {
    beforeEach(() => {
        vStore = new VuexStore({ schema })

        store = new Vuex.Store({
            modules: {
                vStore
            },
            strict: true,
            plugins: []
        });
    })
    test("models present", () => {
        expect(store.getters.getField('petCollection')).toMatchObject([])
        expect(store.getters.getField('pet')).toBeNull()
        expect(store.getters.getField('speciesCollection')).toMatchObject([])
        expect(store.getters.getField('species')).toBeNull()
    })
    test("adding works", (done) => {

        store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        }).then(() => {
            expect(store.getters.getField('petCollection').length).toBe(1)
            expect(store.getters.getField('pet.attributes.name')).toBe("Garfield")
            done()
        })
    })
    test("fetch one works", async (done) => {

        await store.dispatch('create', {
            type: 'pet',
            id:"garfield",
            attributes: {
                name: 'Garfield'
            }
        })
        await store.dispatch('create', {
            type: 'pet',
            id:"whiskas",
            attributes: {
                name: 'Whiskas'
            }
        })
        await store.dispatch('fetchOne',{model:'pet', id:'garfield'})
        expect(store.getters.getField('pet.attributes.name')).toBe("Garfield")
        done()
    })
    test("updating works", async (done) => {
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        })
        let garfield = clone(store.getters.getField('pet'))
        garfield.attributes.name = "Lassie"
        await store.dispatch('update', garfield)
        expect(store.getters.getField('petCollection').length).toBe(1)
        expect(store.getters.getField('pet.attributes.name')).toBe("Lassie")
        done()
    })
    test("deleting works", async (done) => {
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        })
        let garfield = clone(store.getters.getField('pet'))
        await store.dispatch('delete', garfield)
        expect(store.getters.getField('petCollection').length).toBe(0)
        expect(store.getters.getField('pet')).toBeNull()
        done()
    })
})
describe("relationship example", () => {
    beforeEach(async() => {
        vStore = new VuexStore({ schema })

        store = new Vuex.Store({
            modules: {
                vStore
            },
            strict: true,
            plugins: []
        });
        await store.dispatch('create', {
            type: 'species',
            attributes: {
                name: 'cat'
            }
        })
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            },
            relationships:{
                species:{
                    data: store.getters.getField("species")
                }
            }
        })
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Whiskas'
            },
            relationships:{
                species:{
                    data: store.getters.getField("species")
                }
            }
        })
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Lassie'
            }
        })
    })
    test("querying relation hasMany works", async (done) => {
        await store.dispatch('fetchAllOf',"pet")
        expect(store.getters.getField('petCollection').length).toBe(3)
        await store.dispatch('fetchAllOf',"species")
        let cats = store.getters.getField("speciesCollection")[0]
        await store.dispatch('fetchAllRelatedOf',{data:cats,relationship:"pets"})
        expect(store.getters.getField('petCollection').length).toBe(2)
        done()
    })
    test("querying relation hasOne works", async (done) => {
        await store.dispatch('create', {
            type: 'species',
            attributes: {
                name: 'dog'
            }
        })
        await store.dispatch('fetchAllOf',"species")
        let cats = clone(store.getters.getField("speciesCollection")[0])
        await store.dispatch('fetchAllRelatedOf',{data:cats,relationship:"pets"})
        await store.dispatch('fetchRelatedOf',{data: store.getters.getField('petCollection')[0], relationship:"species"})
        expect(store.getters.getField('species.attributes.name')).toBe("cat")
        done()
    })
})