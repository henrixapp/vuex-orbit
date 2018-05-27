"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require("@orbit/store");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class VuexStore extends _store2.default {
    constructor(settings = {}) {
        super(settings);
        this.namespaced = false;
        if (settings.schema) {
            //generate vuex store
            this.state = this.state || {};
            Object.keys(this._schema.models).forEach(type => {
                let model = settings.schema.getModel(type);
                this.state = this.state || {};
                //add to state
                this.state[this._schema.singularize(type)] = null;
                this.state[this._schema.pluralize(type)] = [];
            });
            //map fields
            this.getters = {
                getField: state => {
                    return path => path.split(/[.[\]]+/).reduce((prev, key) => prev[key], state);
                }
            };
            this.actions = {
                //TODO: Add fetch settings like json api
                create: ({ commit, dispatch }, record) => {
                    this.update(t => t.addRecord(record)).then(data => {
                        dispatch("fetchAllOf", record.type);
                        commit("set", { data: record, model: this._schema.singularize(record.type) });
                        //TODO: relationships 
                    });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: ({ commit }, model) => {
                    this.query(q => q.findRecords(model)).then(data => {
                        commit('set', { data, model: this._schema.pluralize(model) });
                    });
                },
                fetchAllRelatedOf: ({ commit }, query) => {
                    this.query(q => q.findRelatedRecords(query.data, query.relationship)).then(data => {
                        commit('set', { data, model: query.relationship });
                    });
                },
                fetchRelatedOf: ({ commit }, query) => {
                    this.query(q => q.findRelatedRecord(query.data, query.relationship)).then(data => {
                        commit('set', { data, model: query.relationship });
                    });
                },
                fetchOne: ({ commit }, { model, id }) => {
                    this.query(q => q.findRecord({ type: model, id })).then(data => commit('set', { data, model: this._schema.singularize(model) }));
                },
                /*update: ({ commit }, data: Record) => {
                    this.update((t) => t.replaceRecord(data)).then(() =>
                        commit('set', { data, model: data.type })
                    )
                },*/
                delete: ({ commit, dispatch }, data) => {
                    this.update(t => t.removeRecord(data)).then(() => {
                        //update
                        dispatch("fetchAllOf", data.type);
                    });
                },
                updating: (store, options) => {
                    this.update(options.transformOrOperations).then(data => {
                        options.thenable(store, data);
                    });
                },
                querying: (store, options) => {
                    this.query(q => {
                        return options.queryOrExpression(q);
                    }).then(data => {
                        options.thenable(store, data);
                    });
                }
                //TODO: RelatedRecords update and delete
            };
            this.mutations = {
                set: (state, { data, model }) => {
                    state[model] = data;
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        state[this.schema.pluralize(model)].forEach(item => {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                            }
                        });
                    }
                },
                updateField: (state, { path, value }) => {
                    //set in field
                    path.split(/[.[\]]+/).reduce((prev, key, index, array) => {
                        if (array.length === index + 1) {
                            // eslint-disable-next-line no-param-reassign
                            prev[key] = value;
                        }
                        return prev[key];
                    }, state);
                }
            };
        }
    }
}
exports.default = VuexStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwibmFtZXNwYWNlZCIsInNjaGVtYSIsInN0YXRlIiwiT2JqZWN0Iiwia2V5cyIsIl9zY2hlbWEiLCJtb2RlbHMiLCJmb3JFYWNoIiwidHlwZSIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJzaW5ndWxhcml6ZSIsInBsdXJhbGl6ZSIsImdldHRlcnMiLCJnZXRGaWVsZCIsInBhdGgiLCJzcGxpdCIsInJlZHVjZSIsInByZXYiLCJrZXkiLCJhY3Rpb25zIiwiY3JlYXRlIiwiY29tbWl0IiwiZGlzcGF0Y2giLCJyZWNvcmQiLCJ1cGRhdGUiLCJ0IiwiYWRkUmVjb3JkIiwidGhlbiIsImRhdGEiLCJmZXRjaEFsbE9mIiwicXVlcnkiLCJxIiwiZmluZFJlY29yZHMiLCJmZXRjaEFsbFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkcyIsInJlbGF0aW9uc2hpcCIsImZldGNoUmVsYXRlZE9mIiwiZmluZFJlbGF0ZWRSZWNvcmQiLCJmZXRjaE9uZSIsImlkIiwiZmluZFJlY29yZCIsImRlbGV0ZSIsInJlbW92ZVJlY29yZCIsInVwZGF0aW5nIiwic3RvcmUiLCJvcHRpb25zIiwidHJhbnNmb3JtT3JPcGVyYXRpb25zIiwidGhlbmFibGUiLCJxdWVyeWluZyIsInF1ZXJ5T3JFeHByZXNzaW9uIiwibXV0YXRpb25zIiwic2V0IiwibGFzdEluZGV4T2YiLCJsZW5ndGgiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJ1cGRhdGVGaWVsZCIsInZhbHVlIiwiaW5kZXgiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUNlLE1BQU1BLFNBQU4sU0FBd0JDLGVBQXhCLENBQThCO0FBQ3pDQyxnQkFBWUMsV0FBVyxFQUF2QixFQUEyQjtBQUN2QixjQUFNQSxRQUFOO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQixLQUFs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UixLQUE0QjtBQUM3QlAsMEJBQU1PLEtBQU4sSUFBZW9CLElBQWY7QUFDQSx3QkFBSXBCLE1BQU00QyxXQUFOLENBQWtCLEdBQWxCLE1BQTJCNUMsTUFBTTZDLE1BQU4sR0FBZSxDQUE5QyxFQUFpRDtBQUM3Q3BELDhCQUFNLEtBQUtELE1BQUwsQ0FBWVcsU0FBWixDQUFzQkgsS0FBdEIsQ0FBTixFQUFvQ0YsT0FBcEMsQ0FBNENnRCxRQUFRO0FBQ2hELGdDQUFJQSxLQUFLZixFQUFMLEtBQVlYLEtBQUtXLEVBQXJCLEVBQXlCO0FBQ3JCZSxxQ0FBS0MsVUFBTCxHQUFrQjNCLEtBQUsyQixVQUF2QjtBQUNBRCxxQ0FBS0UsYUFBTCxHQUFxQjVCLEtBQUs0QixhQUExQjtBQUNBRixxQ0FBS25ELElBQUwsR0FBWXlCLEtBQUt6QixJQUFqQjtBQUNIO0FBQ0oseUJBTkQ7QUFPSDtBQUNKLGlCQVpZO0FBYWJzRCw2QkFBYSxDQUFDeEQsS0FBRCxFQUFRLEVBQUVhLElBQUYsRUFBUTRDLEtBQVIsRUFBUixLQUE0QjtBQUNyQztBQUNBNUMseUJBQUtDLEtBQUwsQ0FBVyxTQUFYLEVBQXNCQyxNQUF0QixDQUE2QixDQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWXlDLEtBQVosRUFBbUJDLEtBQW5CLEtBQTZCO0FBQ3RELDRCQUFJQSxNQUFNUCxNQUFOLEtBQWlCTSxRQUFRLENBQTdCLEVBQWdDO0FBQzVCO0FBQ0ExQyxpQ0FBS0MsR0FBTCxJQUFZd0MsS0FBWjtBQUNIO0FBQ0QsK0JBQU96QyxLQUFLQyxHQUFMLENBQVA7QUFDSCxxQkFORCxFQU1HakIsS0FOSDtBQU9IO0FBdEJZLGFBQWpCO0FBd0JIO0FBQ0o7QUFwR3dDO2tCQUF4Qk4sUyIsImZpbGUiOiJ2dWV4LXN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZSh0eXBlKV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4gcHJldltrZXldLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQuYWRkUmVjb3JkKHJlY29yZCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgcmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YTogcmVjb3JkLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHJlY29yZC50eXBlKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogcmVsYXRpb25zaGlwcyBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6ICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5wbHVyYWxpemUobW9kZWwpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKG1vZGVsKSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKnVwZGF0ZTogKHsgY29tbWl0IH0sIGRhdGE6IFJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgodCkgPT4gdC5yZXBsYWNlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSwqL1xuICAgICAgICAgICAgICAgIGRlbGV0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0aW9ucy50cmFuc2Zvcm1Pck9wZXJhdGlvbnMpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeWluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5xdWVyeU9yRXhwcmVzc2lvbihxKTtcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNldDogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmxhc3RJbmRleE9mKCdzJykgIT09IG1vZGVsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW3RoaXMuc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCldLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gZGF0YS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbGF0aW9uc2hpcHMgPSBkYXRhLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ua2V5cyA9IGRhdGEua2V5cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlRmllbGQ6IChzdGF0ZSwgeyBwYXRoLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGluIGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=