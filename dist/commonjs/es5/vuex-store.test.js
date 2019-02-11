'use strict';

var _data = require('@orbit/data');

var _vuexStore = require('./vuex-store');

var _vuexStore2 = _interopRequireDefault(_vuexStore);

var _testUtils = require('@vue/test-utils');

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _utils = require('@orbit/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localVue = (0, _testUtils.createLocalVue)();
localVue.use(_vuex2.default);
// @ts-ignore
var schemaDefinition = {
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
var schema = new _data.Schema(schemaDefinition);
var vStore = new _vuexStore2.default({ schema: schema });
var store = new _vuex2.default.Store({
    modules: {
        vStore: vStore
    },
    strict: true,
    plugins: []
});
describe("simple example", function () {
    beforeEach(function () {
        vStore = new _vuexStore2.default({ schema: schema });
        store = new _vuex2.default.Store({
            modules: {
                vStore: vStore
            },
            strict: true,
            plugins: []
        });
    });
    test("models present", function () {
        expect(store.getters.getField('petCollection')).toMatchObject([]);
        expect(store.getters.getField('pet')).toBeNull();
        expect(store.getters.getField('speciesCollection')).toMatchObject([]);
        expect(store.getters.getField('species')).toBeNull();
    });
    test("adding works", function (done) {
        store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        }).then(function () {
            expect(store.getters.getField('petCollection').length).toBe(1);
            expect(store.getters.getField('pet.attributes.name')).toBe("Garfield");
            done();
        });
    });
    test("updating works", async function (done) {
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        });
        var garfield = (0, _utils.clone)(store.getters.getField('pet'));
        garfield.attributes.name = "Lassie";
        await store.dispatch('update', garfield);
        expect(store.getters.getField('petCollection').length).toBe(1);
        expect(store.getters.getField('pet.attributes.name')).toBe("Lassie");
        done();
    });
    test("deleting works", async function (done) {
        await store.dispatch('create', {
            type: 'pet',
            attributes: {
                name: 'Garfield'
            }
        });
        var garfield = (0, _utils.clone)(store.getters.getField('pet'));
        await store.dispatch('delete', garfield);
        expect(store.getters.getField('petCollection').length).toBe(0);
        expect(store.getters.getField('pet')).toBeNull();
        done();
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUudGVzdC5qcyJdLCJuYW1lcyI6WyJsb2NhbFZ1ZSIsInNjaGVtYURlZmluaXRpb24iLCJtb2RlbHMiLCJwZXQiLCJhdHRyaWJ1dGVzIiwibmFtZSIsInR5cGUiLCJzcGVjaWVzIiwic2NoZW1hIiwidlN0b3JlIiwic3RvcmUiLCJWdWV4IiwibW9kdWxlcyIsInN0cmljdCIsInBsdWdpbnMiLCJkZXNjcmliZSIsImJlZm9yZUVhY2giLCJ0ZXN0IiwiZXhwZWN0IiwiZG9uZSIsImdhcmZpZWxkIiwiY2xvbmUiXSwibWFwcGluZ3MiOiI7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQSxJQUFNQSxXQUFOLGdDQUFBO0FBQ0FBLFNBQUFBLEdBQUFBLENBQUFBLGNBQUFBO0FBQ0E7QUFDQSxJQUFNQyxtQkFBbUI7QUFDckJDLFlBQVE7QUFDSkMsYUFBSztBQUNEQyx3QkFBWTtBQUNSQyxzQkFBTTtBQUNGQywwQkFBTTtBQURKO0FBREU7QUFEWCxTQUREO0FBUUpDLGlCQUFTO0FBQ0xILHdCQUFZO0FBQ1JDLHNCQUFNO0FBQ0ZDLDBCQUFNO0FBREo7QUFERTtBQURQO0FBUkw7QUFEYSxDQUF6QjtBQWtCQSxJQUFNRSxTQUFTLElBQUEsWUFBQSxDQUFmLGdCQUFlLENBQWY7QUFDQSxJQUFJQyxTQUFTLElBQUEsbUJBQUEsQ0FBYyxFQUFFRCxRQUE3QixNQUEyQixFQUFkLENBQWI7QUFDQSxJQUFJRSxRQUFRLElBQUlDLGVBQUosS0FBQSxDQUFlO0FBQ3ZCQyxhQUFTO0FBQ0xILGdCQUFBQTtBQURLLEtBRGM7QUFJdkJJLFlBSnVCLElBQUE7QUFLdkJDLGFBQVM7QUFMYyxDQUFmLENBQVo7QUFPQUMsU0FBQUEsZ0JBQUFBLEVBQTJCLFlBQU07QUFDN0JDLGVBQVcsWUFBTTtBQUNiUCxpQkFBUyxJQUFBLG1CQUFBLENBQWMsRUFBRUQsUUFBekJDLE1BQXVCLEVBQWQsQ0FBVEE7QUFDQUMsZ0JBQVEsSUFBSUMsZUFBSixLQUFBLENBQWU7QUFDbkJDLHFCQUFTO0FBQ0xILHdCQUFBQTtBQURLLGFBRFU7QUFJbkJJLG9CQUptQixJQUFBO0FBS25CQyxxQkFBUztBQUxVLFNBQWYsQ0FBUko7QUFGSk0sS0FBQUE7QUFVQUMsU0FBQUEsZ0JBQUFBLEVBQXVCLFlBQU07QUFDekJDLGVBQU9SLE1BQUFBLE9BQUFBLENBQUFBLFFBQUFBLENBQVBRLGVBQU9SLENBQVBRLEVBQUFBLGFBQUFBLENBQUFBLEVBQUFBO0FBQ0FBLGVBQU9SLE1BQUFBLE9BQUFBLENBQUFBLFFBQUFBLENBQVBRLEtBQU9SLENBQVBRLEVBQUFBLFFBQUFBO0FBQ0FBLGVBQU9SLE1BQUFBLE9BQUFBLENBQUFBLFFBQUFBLENBQVBRLG1CQUFPUixDQUFQUSxFQUFBQSxhQUFBQSxDQUFBQSxFQUFBQTtBQUNBQSxlQUFPUixNQUFBQSxPQUFBQSxDQUFBQSxRQUFBQSxDQUFQUSxTQUFPUixDQUFQUSxFQUFBQSxRQUFBQTtBQUpKRCxLQUFBQTtBQU1BQSxTQUFBQSxjQUFBQSxFQUFxQixVQUFBLElBQUEsRUFBUTtBQUN6QlAsY0FBQUEsUUFBQUEsQ0FBQUEsUUFBQUEsRUFBeUI7QUFDckJKLGtCQURxQixLQUFBO0FBRXJCRix3QkFBWTtBQUNSQyxzQkFBTTtBQURFO0FBRlMsU0FBekJLLEVBQUFBLElBQUFBLENBS1EsWUFBTTtBQUNWUSxtQkFBT1IsTUFBQUEsT0FBQUEsQ0FBQUEsUUFBQUEsQ0FBQUEsZUFBQUEsRUFBUFEsTUFBQUEsRUFBQUEsSUFBQUEsQ0FBQUEsQ0FBQUE7QUFDQUEsbUJBQU9SLE1BQUFBLE9BQUFBLENBQUFBLFFBQUFBLENBQVBRLHFCQUFPUixDQUFQUSxFQUFBQSxJQUFBQSxDQUFBQSxVQUFBQTtBQUNBQztBQVJKVCxTQUFBQTtBQURKTyxLQUFBQTtBQVlBQSxTQUFBQSxnQkFBQUEsRUFBdUIsZ0JBQUEsSUFBQSxFQUFjO0FBQ2pDLGNBQU0sTUFBQSxRQUFBLENBQUEsUUFBQSxFQUF5QjtBQUMzQlgsa0JBRDJCLEtBQUE7QUFFM0JGLHdCQUFZO0FBQ1JDLHNCQUFNO0FBREU7QUFGZSxTQUF6QixDQUFOO0FBTUEsWUFBSWUsV0FBV0Msa0JBQU1YLE1BQUFBLE9BQUFBLENBQUFBLFFBQUFBLENBQXJCLEtBQXFCQSxDQUFOVyxDQUFmO0FBQ0FELGlCQUFBQSxVQUFBQSxDQUFBQSxJQUFBQSxHQUFBQSxRQUFBQTtBQUNBLGNBQU1WLE1BQUFBLFFBQUFBLENBQUFBLFFBQUFBLEVBQU4sUUFBTUEsQ0FBTjtBQUNBUSxlQUFPUixNQUFBQSxPQUFBQSxDQUFBQSxRQUFBQSxDQUFBQSxlQUFBQSxFQUFQUSxNQUFBQSxFQUFBQSxJQUFBQSxDQUFBQSxDQUFBQTtBQUNBQSxlQUFPUixNQUFBQSxPQUFBQSxDQUFBQSxRQUFBQSxDQUFQUSxxQkFBT1IsQ0FBUFEsRUFBQUEsSUFBQUEsQ0FBQUEsUUFBQUE7QUFDQUM7QUFaSkYsS0FBQUE7QUFjQUEsU0FBQUEsZ0JBQUFBLEVBQXVCLGdCQUFBLElBQUEsRUFBYztBQUNqQyxjQUFNLE1BQUEsUUFBQSxDQUFBLFFBQUEsRUFBeUI7QUFDM0JYLGtCQUQyQixLQUFBO0FBRTNCRix3QkFBWTtBQUNSQyxzQkFBTTtBQURFO0FBRmUsU0FBekIsQ0FBTjtBQU1BLFlBQUllLFdBQVdDLGtCQUFNWCxNQUFBQSxPQUFBQSxDQUFBQSxRQUFBQSxDQUFyQixLQUFxQkEsQ0FBTlcsQ0FBZjtBQUNBLGNBQU1YLE1BQUFBLFFBQUFBLENBQUFBLFFBQUFBLEVBQU4sUUFBTUEsQ0FBTjtBQUNBUSxlQUFPUixNQUFBQSxPQUFBQSxDQUFBQSxRQUFBQSxDQUFBQSxlQUFBQSxFQUFQUSxNQUFBQSxFQUFBQSxJQUFBQSxDQUFBQSxDQUFBQTtBQUNBQSxlQUFPUixNQUFBQSxPQUFBQSxDQUFBQSxRQUFBQSxDQUFQUSxLQUFPUixDQUFQUSxFQUFBQSxRQUFBQTtBQUNBQztBQVhKRixLQUFBQTtBQTNDSkYsQ0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hlbWEgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgVnVleFN0b3JlIGZyb20gJy4vdnVleC1zdG9yZSc7XG5pbXBvcnQgeyBjcmVhdGVMb2NhbFZ1ZSB9IGZyb20gJ0B2dWUvdGVzdC11dGlscyc7XG5pbXBvcnQgVnVleCBmcm9tIFwidnVleFwiO1xuaW1wb3J0IHsgY2xvbmUgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuY29uc3QgbG9jYWxWdWUgPSBjcmVhdGVMb2NhbFZ1ZSgpO1xubG9jYWxWdWUudXNlKFZ1ZXgpO1xuLy8gQHRzLWlnbm9yZVxuY29uc3Qgc2NoZW1hRGVmaW5pdGlvbiA9IHtcbiAgICBtb2RlbHM6IHtcbiAgICAgICAgcGV0OiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjaWVzOiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbmNvbnN0IHNjaGVtYSA9IG5ldyBTY2hlbWEoc2NoZW1hRGVmaW5pdGlvbik7XG5sZXQgdlN0b3JlID0gbmV3IFZ1ZXhTdG9yZSh7IHNjaGVtYSB9KTtcbmxldCBzdG9yZSA9IG5ldyBWdWV4LlN0b3JlKHtcbiAgICBtb2R1bGVzOiB7XG4gICAgICAgIHZTdG9yZVxuICAgIH0sXG4gICAgc3RyaWN0OiB0cnVlLFxuICAgIHBsdWdpbnM6IFtdXG59KTtcbmRlc2NyaWJlKFwic2ltcGxlIGV4YW1wbGVcIiwgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICB2U3RvcmUgPSBuZXcgVnVleFN0b3JlKHsgc2NoZW1hIH0pO1xuICAgICAgICBzdG9yZSA9IG5ldyBWdWV4LlN0b3JlKHtcbiAgICAgICAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgICAgICAgICB2U3RvcmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHJpY3Q6IHRydWUsXG4gICAgICAgICAgICBwbHVnaW5zOiBbXVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0ZXN0KFwibW9kZWxzIHByZXNlbnRcIiwgKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgncGV0Q29sbGVjdGlvbicpKS50b01hdGNoT2JqZWN0KFtdKTtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldCcpKS50b0JlTnVsbCgpO1xuICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgnc3BlY2llc0NvbGxlY3Rpb24nKSkudG9NYXRjaE9iamVjdChbXSk7XG4gICAgICAgIGV4cGVjdChzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdzcGVjaWVzJykpLnRvQmVOdWxsKCk7XG4gICAgfSk7XG4gICAgdGVzdChcImFkZGluZyB3b3Jrc1wiLCBkb25lID0+IHtcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goJ2NyZWF0ZScsIHtcbiAgICAgICAgICAgIHR5cGU6ICdwZXQnLFxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHYXJmaWVsZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgncGV0Q29sbGVjdGlvbicpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdwZXQuYXR0cmlidXRlcy5uYW1lJykpLnRvQmUoXCJHYXJmaWVsZFwiKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdChcInVwZGF0aW5nIHdvcmtzXCIsIGFzeW5jIGRvbmUgPT4ge1xuICAgICAgICBhd2FpdCBzdG9yZS5kaXNwYXRjaCgnY3JlYXRlJywge1xuICAgICAgICAgICAgdHlwZTogJ3BldCcsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0dhcmZpZWxkJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGdhcmZpZWxkID0gY2xvbmUoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgncGV0JykpO1xuICAgICAgICBnYXJmaWVsZC5hdHRyaWJ1dGVzLm5hbWUgPSBcIkxhc3NpZVwiO1xuICAgICAgICBhd2FpdCBzdG9yZS5kaXNwYXRjaCgndXBkYXRlJywgZ2FyZmllbGQpO1xuICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0dGVycy5nZXRGaWVsZCgncGV0Q29sbGVjdGlvbicpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldC5hdHRyaWJ1dGVzLm5hbWUnKSkudG9CZShcIkxhc3NpZVwiKTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH0pO1xuICAgIHRlc3QoXCJkZWxldGluZyB3b3Jrc1wiLCBhc3luYyBkb25lID0+IHtcbiAgICAgICAgYXdhaXQgc3RvcmUuZGlzcGF0Y2goJ2NyZWF0ZScsIHtcbiAgICAgICAgICAgIHR5cGU6ICdwZXQnLFxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHYXJmaWVsZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBnYXJmaWVsZCA9IGNsb25lKHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldCcpKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuZGlzcGF0Y2goJ2RlbGV0ZScsIGdhcmZpZWxkKTtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldHRlcnMuZ2V0RmllbGQoJ3BldENvbGxlY3Rpb24nKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChzdG9yZS5nZXR0ZXJzLmdldEZpZWxkKCdwZXQnKSkudG9CZU51bGwoKTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH0pO1xufSk7Il19