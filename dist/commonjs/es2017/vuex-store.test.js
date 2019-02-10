'use strict';

var _data = require('@orbit/data');

var _vuexStore = require('./vuex-store');

var _vuexStore2 = _interopRequireDefault(_vuexStore);

var _testUtils = require('@vue/test-utils');

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

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
            console.log(store.getters.getField('petCollection'));
            expect(store.getters.getField('pet.attributes.name')).toBe("Garfield");
            done();
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUudGVzdC5qcyJdLCJuYW1lcyI6WyJsb2NhbFZ1ZSIsInVzZSIsIlZ1ZXgiLCJzY2hlbWFEZWZpbml0aW9uIiwibW9kZWxzIiwicGV0IiwiYXR0cmlidXRlcyIsIm5hbWUiLCJ0eXBlIiwic3BlY2llcyIsInNjaGVtYSIsIlNjaGVtYSIsInZTdG9yZSIsIlZ1ZXhTdG9yZSIsInN0b3JlIiwiU3RvcmUiLCJtb2R1bGVzIiwic3RyaWN0IiwicGx1Z2lucyIsImRlc2NyaWJlIiwiYmVmb3JlRWFjaCIsInRlc3QiLCJleHBlY3QiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJ0b01hdGNoT2JqZWN0IiwidG9CZU51bGwiLCJkb25lIiwiZGlzcGF0Y2giLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsInRvQmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBQ0EsTUFBTUEsV0FBVyxnQ0FBakI7QUFDQUEsU0FBU0MsR0FBVCxDQUFhQyxjQUFiO0FBQ0E7QUFDQSxNQUFNQyxtQkFBbUI7QUFDckJDLFlBQVE7QUFDSkMsYUFBSztBQUNEQyx3QkFBWTtBQUNSQyxzQkFBTTtBQUNGQywwQkFBTTtBQURKO0FBREU7QUFEWCxTQUREO0FBUUpDLGlCQUFTO0FBQ0xILHdCQUFZO0FBQ1JDLHNCQUFNO0FBQ0ZDLDBCQUFNO0FBREo7QUFERTtBQURQO0FBUkw7QUFEYSxDQUF6QjtBQWtCQSxNQUFNRSxTQUFTLElBQUlDLFlBQUosQ0FBV1IsZ0JBQVgsQ0FBZjtBQUNBLElBQUlTLFNBQVMsSUFBSUMsbUJBQUosQ0FBYyxFQUFFSCxNQUFGLEVBQWQsQ0FBYjtBQUNBLElBQUlJLFFBQVEsSUFBSVosZUFBS2EsS0FBVCxDQUFlO0FBQ3ZCQyxhQUFTO0FBQ0xKO0FBREssS0FEYztBQUl2QkssWUFBUSxJQUplO0FBS3ZCQyxhQUFTO0FBTGMsQ0FBZixDQUFaO0FBT0FDLFNBQVMsZ0JBQVQsRUFBMkIsTUFBTTtBQUM3QkMsZUFBVyxNQUFNO0FBQ2JSLGlCQUFTLElBQUlDLG1CQUFKLENBQWMsRUFBRUgsTUFBRixFQUFkLENBQVQ7QUFDQUksZ0JBQVEsSUFBSVosZUFBS2EsS0FBVCxDQUFlO0FBQ25CQyxxQkFBUztBQUNMSjtBQURLLGFBRFU7QUFJbkJLLG9CQUFRLElBSlc7QUFLbkJDLHFCQUFTO0FBTFUsU0FBZixDQUFSO0FBT0gsS0FURDtBQVVBRyxTQUFLLGdCQUFMLEVBQXVCLE1BQU07QUFDekJDLGVBQU9SLE1BQU1TLE9BQU4sQ0FBY0MsUUFBZCxDQUF1QixlQUF2QixDQUFQLEVBQWdEQyxhQUFoRCxDQUE4RCxFQUE5RDtBQUNBSCxlQUFPUixNQUFNUyxPQUFOLENBQWNDLFFBQWQsQ0FBdUIsS0FBdkIsQ0FBUCxFQUFzQ0UsUUFBdEM7QUFDQUosZUFBT1IsTUFBTVMsT0FBTixDQUFjQyxRQUFkLENBQXVCLG1CQUF2QixDQUFQLEVBQW9EQyxhQUFwRCxDQUFrRSxFQUFsRTtBQUNBSCxlQUFPUixNQUFNUyxPQUFOLENBQWNDLFFBQWQsQ0FBdUIsU0FBdkIsQ0FBUCxFQUEwQ0UsUUFBMUM7QUFDSCxLQUxEO0FBTUFMLFNBQUssY0FBTCxFQUFxQk0sUUFBUTtBQUN6QmIsY0FBTWMsUUFBTixDQUFlLFFBQWYsRUFBeUI7QUFDckJwQixrQkFBTSxLQURlO0FBRXJCRix3QkFBWTtBQUNSQyxzQkFBTTtBQURFO0FBRlMsU0FBekIsRUFLR3NCLElBTEgsQ0FLUSxNQUFNO0FBQ1ZDLG9CQUFRQyxHQUFSLENBQVlqQixNQUFNUyxPQUFOLENBQWNDLFFBQWQsQ0FBdUIsZUFBdkIsQ0FBWjtBQUNBRixtQkFBT1IsTUFBTVMsT0FBTixDQUFjQyxRQUFkLENBQXVCLHFCQUF2QixDQUFQLEVBQXNEUSxJQUF0RCxDQUEyRCxVQUEzRDtBQUNBTDtBQUNILFNBVEQ7QUFVSCxLQVhEO0FBWUgsQ0E3QkQiLCJmaWxlIjoidnVleC1zdG9yZS50ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IFZ1ZXhTdG9yZSBmcm9tICcuL3Z1ZXgtc3RvcmUnO1xuaW1wb3J0IHsgY3JlYXRlTG9jYWxWdWUgfSBmcm9tICdAdnVlL3Rlc3QtdXRpbHMnO1xuaW1wb3J0IFZ1ZXggZnJvbSBcInZ1ZXhcIjtcbmNvbnN0IGxvY2FsVnVlID0gY3JlYXRlTG9jYWxWdWUoKTtcbmxvY2FsVnVlLnVzZShWdWV4KTtcbi8vIEB0cy1pZ25vcmVcbmNvbnN0IHNjaGVtYURlZmluaXRpb24gPSB7XG4gICAgbW9kZWxzOiB7XG4gICAgICAgIHBldDoge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3BlY2llczoge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5jb25zdCBzY2hlbWEgPSBuZXcgU2NoZW1hKHNjaGVtYURlZmluaXRpb24pO1xubGV0IHZTdG9yZSA9IG5ldyBWdWV4U3RvcmUoeyBzY2hlbWEgfSk7XG5sZXQgc3RvcmUgPSBuZXcgVnVleC5TdG9yZSh7XG4gICAgbW9kdWxlczoge1xuICAgICAgICB2U3RvcmVcbiAgICB9LFxuICAgIHN0cmljdDogdHJ1ZSxcbiAgICBwbHVnaW5zOiBbXVxufSk7XG5kZXNjcmliZShcInNpbXBsZSBleGFtcGxlXCIsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgdlN0b3JlID0gbmV3IFZ1ZXhTdG9yZSh7IHNjaGVtYSB9KTtcbiAgICAgICAgc3RvcmUgPSBuZXcgVnVleC5TdG9yZSh7XG4gICAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAgICAgdlN0b3JlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RyaWN0OiB0cnVlLFxuICAgICAgICAgICAgcGx1Z2luczogW11cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdChcIm1vZGVscyBwcmVzZW50XCIsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldENvbGxlY3Rpb24nKSkudG9NYXRjaE9iamVjdChbXSk7XG4gICAgICAgIGV4cGVjdChzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdwZXQnKSkudG9CZU51bGwoKTtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3NwZWNpZXNDb2xsZWN0aW9uJykpLnRvTWF0Y2hPYmplY3QoW10pO1xuICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgnc3BlY2llcycpKS50b0JlTnVsbCgpO1xuICAgIH0pO1xuICAgIHRlc3QoXCJhZGRpbmcgd29ya3NcIiwgZG9uZSA9PiB7XG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKCdjcmVhdGUnLCB7XG4gICAgICAgICAgICB0eXBlOiAncGV0JyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnR2FyZmllbGQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgncGV0Q29sbGVjdGlvbicpKTtcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdwZXQuYXR0cmlidXRlcy5uYW1lJykpLnRvQmUoXCJHYXJmaWVsZFwiKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiXX0=