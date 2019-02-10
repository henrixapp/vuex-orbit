import { Schema } from '@orbit/data';
import VuexStore from './vuex-store';
import { createLocalVue } from '@vue/test-utils';
import Vuex from "vuex";
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
            console.log(store.getters.getField('petCollection'));
            expect(store.getters.getField('pet.attributes.name')).toBe("Garfield");
            done();
        });
    });
});