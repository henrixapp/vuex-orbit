import { Schema } from '@orbit/data';
import VuexStore from './vuex-store';
import { createLocalVue } from '@vue/test-utils';
import Vuex from "vuex";
import { clone } from '@orbit/utils';
const localVue = createLocalVue();
localVue.use(Vuex);
// @ts-ignore
const schemaDefinition = {
    models: {
        pet: {
            attributes: {
                name: {
                    type: "string"
                }
            }
        },
        species: {
            attributes: {
                name: {
                    type: "string"
                }
            }
        }
    }
};
const schema = new Schema(schemaDefinition);
let vStore = new VuexStore({ schema });
let store = new Vuex.Store({
    modules: {
        vStore
    },
    strict: true,
    plugins: []
});
describe("simple example", () => {
    beforeEach(() => {
        vStore = new VuexStore({ schema });
        store = new Vuex.Store({
            modules: {
                vStore
            },
            strict: true,
            plugins: []
        });
    });
    test("models present", () => {
        expect(store.getters.getField('petCollection')).toMatchObject([]);
        expect(store.getters.getField('pet')).toBeNull();
        expect(store.getters.getField('speciesCollection')).toMatchObject([]);
        expect(store.getters.getField('species')).toBeNull();
    });
    test("adding works", done => {
        store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        }).then(() => {
            expect(store.getters.getField('petCollection').length).toBe(1);
            expect(store.getters.getField('pet.attributes.name')).toBe("Garfield");
            done();
        });
    });
    test("updating works", async done => {
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        });
        let garfield = clone(store.getters.getField('pet'));
        garfield.attributes.name = "Lassie";
        await store.dispatch('update', garfield);
        expect(store.getters.getField('petCollection').length).toBe(1);
        expect(store.getters.getField('pet.attributes.name')).toBe("Lassie");
        done();
    });
    test("deleting works", async done => {
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        });
        let garfield = clone(store.getters.getField('pet'));
        await store.dispatch('delete', garfield);
        expect(store.getters.getField('petCollection').length).toBe(0);
        expect(store.getters.getField('pet')).toBeNull();
        done();
    });
});