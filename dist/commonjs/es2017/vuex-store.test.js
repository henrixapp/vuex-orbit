'use strict';

var _data = require('@orbit/data');

var _vuexStore = require('./vuex-store');

var _vuexStore2 = _interopRequireDefault(_vuexStore);

var _testUtils = require('@vue/test-utils');

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _utils = require('@orbit/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const localVue = (0, _testUtils.createLocalVue)();
localVue.use(_vuex2.default);
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
const schema = new _data.Schema(schemaDefinition);
let vStore = new _vuexStore2.default({ schema });
let store = new _vuex2.default.Store({
    modules: {
        vStore
    },
    strict: true,
    plugins: []
});
describe("simple example", () => {
    beforeEach(() => {
        vStore = new _vuexStore2.default({ schema });
        store = new _vuex2.default.Store({
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
        let garfield = (0, _utils.clone)(store.getters.getField('pet'));
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
        let garfield = (0, _utils.clone)(store.getters.getField('pet'));
        await store.dispatch('delete', garfield);
        expect(store.getters.getField('petCollection').length).toBe(0);
        expect(store.getters.getField('pet')).toBeNull();
        done();
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUudGVzdC5qcyJdLCJuYW1lcyI6WyJsb2NhbFZ1ZSIsInVzZSIsIlZ1ZXgiLCJzY2hlbWFEZWZpbml0aW9uIiwibW9kZWxzIiwicGV0IiwiYXR0cmlidXRlcyIsIm5hbWUiLCJ0eXBlIiwic3BlY2llcyIsInNjaGVtYSIsIlNjaGVtYSIsInZTdG9yZSIsIlZ1ZXhTdG9yZSIsInN0b3JlIiwiU3RvcmUiLCJtb2R1bGVzIiwic3RyaWN0IiwicGx1Z2lucyIsImRlc2NyaWJlIiwiYmVmb3JlRWFjaCIsInRlc3QiLCJleHBlY3QiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJ0b01hdGNoT2JqZWN0IiwidG9CZU51bGwiLCJkb25lIiwiZGlzcGF0Y2giLCJ0aGVuIiwibGVuZ3RoIiwidG9CZSIsImdhcmZpZWxkIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBLE1BQU1BLFdBQVcsZ0NBQWpCO0FBQ0FBLFNBQVNDLEdBQVQsQ0FBYUMsY0FBYjtBQUNBO0FBQ0EsTUFBTUMsbUJBQW1CO0FBQ3JCQyxZQUFRO0FBQ0pDLGFBQUs7QUFDREMsd0JBQVk7QUFDUkMsc0JBQU07QUFDRkMsMEJBQU07QUFESjtBQURFO0FBRFgsU0FERDtBQVFKQyxpQkFBUztBQUNMSCx3QkFBWTtBQUNSQyxzQkFBTTtBQUNGQywwQkFBTTtBQURKO0FBREU7QUFEUDtBQVJMO0FBRGEsQ0FBekI7QUFrQkEsTUFBTUUsU0FBUyxJQUFJQyxZQUFKLENBQVdSLGdCQUFYLENBQWY7QUFDQSxJQUFJUyxTQUFTLElBQUlDLG1CQUFKLENBQWMsRUFBRUgsTUFBRixFQUFkLENBQWI7QUFDQSxJQUFJSSxRQUFRLElBQUlaLGVBQUthLEtBQVQsQ0FBZTtBQUN2QkMsYUFBUztBQUNMSjtBQURLLEtBRGM7QUFJdkJLLFlBQVEsSUFKZTtBQUt2QkMsYUFBUztBQUxjLENBQWYsQ0FBWjtBQU9BQyxTQUFTLGdCQUFULEVBQTJCLE1BQU07QUFDN0JD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OlsiaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IFZ1ZXhTdG9yZSBmcm9tICcuL3Z1ZXgtc3RvcmUnO1xuaW1wb3J0IHsgY3JlYXRlTG9jYWxWdWUgfSBmcm9tICdAdnVlL3Rlc3QtdXRpbHMnO1xuaW1wb3J0IFZ1ZXggZnJvbSBcInZ1ZXhcIjtcbmltcG9ydCB7IGNsb25lIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmNvbnN0IGxvY2FsVnVlID0gY3JlYXRlTG9jYWxWdWUoKTtcbmxvY2FsVnVlLnVzZShWdWV4KTtcbi8vIEB0cy1pZ25vcmVcbmNvbnN0IHNjaGVtYURlZmluaXRpb24gPSB7XG4gICAgbW9kZWxzOiB7XG4gICAgICAgIHBldDoge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3BlY2llczoge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5jb25zdCBzY2hlbWEgPSBuZXcgU2NoZW1hKHNjaGVtYURlZmluaXRpb24pO1xubGV0IHZTdG9yZSA9IG5ldyBWdWV4U3RvcmUoeyBzY2hlbWEgfSk7XG5sZXQgc3RvcmUgPSBuZXcgVnVleC5TdG9yZSh7XG4gICAgbW9kdWxlczoge1xuICAgICAgICB2U3RvcmVcbiAgICB9LFxuICAgIHN0cmljdDogdHJ1ZSxcbiAgICBwbHVnaW5zOiBbXVxufSk7XG5kZXNjcmliZShcInNpbXBsZSBleGFtcGxlXCIsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgdlN0b3JlID0gbmV3IFZ1ZXhTdG9yZSh7IHNjaGVtYSB9KTtcbiAgICAgICAgc3RvcmUgPSBuZXcgVnVleC5TdG9yZSh7XG4gICAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAgICAgdlN0b3JlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RyaWN0OiB0cnVlLFxuICAgICAgICAgICAgcGx1Z2luczogW11cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdChcIm1vZGVscyBwcmVzZW50XCIsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldENvbGxlY3Rpb24nKSkudG9NYXRjaE9iamVjdChbXSk7XG4gICAgICAgIGV4cGVjdChzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdwZXQnKSkudG9CZU51bGwoKTtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3NwZWNpZXNDb2xsZWN0aW9uJykpLnRvTWF0Y2hPYmplY3QoW10pO1xuICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgnc3BlY2llcycpKS50b0JlTnVsbCgpO1xuICAgIH0pO1xuICAgIHRlc3QoXCJhZGRpbmcgd29ya3NcIiwgZG9uZSA9PiB7XG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKCdjcmVhdGUnLCB7XG4gICAgICAgICAgICB0eXBlOiAncGV0JyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnR2FyZmllbGQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldENvbGxlY3Rpb24nKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgncGV0LmF0dHJpYnV0ZXMubmFtZScpKS50b0JlKFwiR2FyZmllbGRcIik7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRlc3QoXCJ1cGRhdGluZyB3b3Jrc1wiLCBhc3luYyBkb25lID0+IHtcbiAgICAgICAgYXdhaXQgc3RvcmUuZGlzcGF0Y2goJ2NyZWF0ZScsIHtcbiAgICAgICAgICAgIHR5cGU6ICdwZXQnLFxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHYXJmaWVsZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBnYXJmaWVsZCA9IGNsb25lKHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldCcpKTtcbiAgICAgICAgZ2FyZmllbGQuYXR0cmlidXRlcy5uYW1lID0gXCJMYXNzaWVcIjtcbiAgICAgICAgYXdhaXQgc3RvcmUuZGlzcGF0Y2goJ3VwZGF0ZScsIGdhcmZpZWxkKTtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldENvbGxlY3Rpb24nKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdwZXQuYXR0cmlidXRlcy5uYW1lJykpLnRvQmUoXCJMYXNzaWVcIik7XG4gICAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgICB0ZXN0KFwiZGVsZXRpbmcgd29ya3NcIiwgYXN5bmMgZG9uZSA9PiB7XG4gICAgICAgIGF3YWl0IHN0b3JlLmRpc3BhdGNoKCdjcmVhdGUnLCB7XG4gICAgICAgICAgICB0eXBlOiAncGV0JyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnR2FyZmllbGQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZ2FyZmllbGQgPSBjbG9uZShzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdwZXQnKSk7XG4gICAgICAgIGF3YWl0IHN0b3JlLmRpc3BhdGNoKCdkZWxldGUnLCBnYXJmaWVsZCk7XG4gICAgICAgIGV4cGVjdChzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdwZXRDb2xsZWN0aW9uJykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgncGV0JykpLnRvQmVOdWxsKCk7XG4gICAgICAgIGRvbmUoKTtcbiAgICB9KTtcbn0pOyJdfQ==