'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require('@orbit/store');

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
                //singularized
                this.state[type] = null;
                //and a collection
                this.state[`${type}Collection`] = [];
            });
            //map fields
            this.getters = {
                getField: state => {
                    return path => path.split(/[.[\]]+/).reduce((prev, key) => {
                        if (prev != null) {
                            return prev[key];
                        } else {
                            return null;
                        }
                    }, state);
                }
            };
            this.actions = {
                //TODO: Add fetch settings like json api
                create: async ({ commit }, record) => {
                    let data = await this.update(t => t.addRecord(record));
                    commit("set", { data, model: data.type });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: async ({ commit }, model) => {
                    let data = await this.query(q => q.findRecords(model));
                    commit('set', { data, model: `${model}Collection` });
                },
                fetchAllRelatedOf: ({ commit }, query) => {
                    this.query(q => q.findRelatedRecords(query.data, query.relationship)).then(data => {
                        commit('set', { data, model: `${this.schema.singularize(query.relationship)}Collection` }); //mind that this is the pluralized version
                    });
                },
                fetchRelatedOf: ({ commit }, query) => {
                    this.query(q => q.findRelatedRecord(query.data, query.relationship)).then(data => {
                        commit('set', { data, model: query.relationship }); //singularized version
                    });
                },
                fetchOne: ({ commit }, { model, id }) => {
                    this.query(q => q.findRecord({ type: model, id })).then(data => commit('set', { data, model: model }));
                },
                update: async ({ commit }, record) => {
                    let data = await this.update(t => t.updateRecord(record));
                    commit('set', { data, model: data.type });
                },
                delete: async ({ commit, dispatch }, data) => {
                    await this.update(t => t.removeRecord(data));
                    await dispatch("fetchAllOf", data.type);
                    commit('set', { data: null, model: data.type });
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
                    if (data === null) {
                        return;
                    }
                    if (!model.endsWith("Collection")) {
                        //update also in Collection
                        let setted = false;
                        state[`${model}Collection`].forEach(item => {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                                setted = true;
                            }
                        });
                        if (!setted) {
                            state[`${model}Collection`].push(data);
                        }
                    } else {
                        //splice data in oder to achieve updates
                        state[model] = [];
                        state[model] = data;
                        state[model].splice(data.length);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwibmFtZXNwYWNlZCIsInNjaGVtYSIsInN0YXRlIiwiT2JqZWN0Iiwia2V5cyIsIl9zY2hlbWEiLCJtb2RlbHMiLCJmb3JFYWNoIiwidHlwZSIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImNyZWF0ZSIsImNvbW1pdCIsInJlY29yZCIsImRhdGEiLCJ1cGRhdGUiLCJ0IiwiYWRkUmVjb3JkIiwiZmV0Y2hBbGxPZiIsInF1ZXJ5IiwicSIsImZpbmRSZWNvcmRzIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJ0aGVuIiwic2luZ3VsYXJpemUiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJ1cGRhdGVSZWNvcmQiLCJkZWxldGUiLCJkaXNwYXRjaCIsInJlbW92ZVJlY29yZCIsInVwZGF0aW5nIiwic3RvcmUiLCJvcHRpb25zIiwidHJhbnNmb3JtT3JPcGVyYXRpb25zIiwidGhlbmFibGUiLCJxdWVyeWluZyIsInF1ZXJ5T3JFeHByZXNzaW9uIiwibXV0YXRpb25zIiwic2V0IiwiZW5kc1dpdGgiLCJzZXR0ZWQiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJwdXNoIiwic3BsaWNlIiwibGVuZ3RoIiwidXBkYXRlRmllbGQiLCJ2YWx1ZSIsImluZGV4IiwiYXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFDZSxNQUFNQSxTQUFOLFNBQXdCQyxlQUF4QixDQUE4QjtBQUN6Q0MsZ0JBQVlDLFdBQVcsRUFBdkIsRUFBMkI7QUFDdkIsY0FBTUEsUUFBTjtB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UixLQUE0QjtBQUNyQztBQUNBakQseUJBQUtDLEtBQUwsQ0FBVyxTQUFYLEVBQXNCQyxNQUF0QixDQUE2QixDQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWThDLEtBQVosRUFBbUJDLEtBQW5CLEtBQTZCO0FBQ3RELDRCQUFJQSxNQUFNSixNQUFOLEtBQWlCRyxRQUFRLENBQTdCLEVBQWdDO0FBQzVCO0FBQ0EvQyxpQ0FBS0MsR0FBTCxJQUFZNkMsS0FBWjtBQUNIO0FBQ0QsK0JBQU85QyxLQUFLQyxHQUFMLENBQVA7QUFDSCxxQkFORCxFQU1HZixLQU5IO0FBT0g7QUFwQ1ksYUFBakI7QUFzQ0g7QUFDSjtBQXBId0M7a0JBQXhCTixTIiwiZmlsZSI6InZ1ZXgtc3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIC8vc2luZ3VsYXJpemVkXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0eXBlXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgLy9hbmQgYSBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVtgJHt0eXBlfUNvbGxlY3Rpb25gXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGFzeW5jICh7IGNvbW1pdCB9LCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCB0aGlzLnVwZGF0ZSh0ID0+IHQuYWRkUmVjb3JkKHJlY29yZCkpO1xuICAgICAgICAgICAgICAgICAgICBjb21taXQoXCJzZXRcIiwgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiBhc3luYyAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpO1xuICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGAke21vZGVsfUNvbGxlY3Rpb25gIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZHMocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogYCR7dGhpcy5zY2hlbWEuc2luZ3VsYXJpemUocXVlcnkucmVsYXRpb25zaGlwKX1Db2xsZWN0aW9uYCB9KTsgLy9taW5kIHRoYXQgdGhpcyBpcyB0aGUgcGx1cmFsaXplZCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZChxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7IC8vc2luZ3VsYXJpemVkIHZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogbW9kZWwgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBhc3luYyAoeyBjb21taXQgfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgdGhpcy51cGRhdGUodCA9PiB0LnVwZGF0ZVJlY29yZChyZWNvcmQpKTtcbiAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBkYXRhLnR5cGUgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGU6IGFzeW5jICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnVwZGF0ZSh0ID0+IHQucmVtb3ZlUmVjb3JkKGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIGRhdGEudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhOiBudWxsLCBtb2RlbDogZGF0YS50eXBlIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShvcHRpb25zLnRyYW5zZm9ybU9yT3BlcmF0aW9ucykudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLnF1ZXJ5T3JFeHByZXNzaW9uKHEpO1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL1RPRE86IFJlbGF0ZWRSZWNvcmRzIHVwZGF0ZSBhbmQgZGVsZXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbW9kZWwuZW5kc1dpdGgoXCJDb2xsZWN0aW9uXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZSBhbHNvIGluIENvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW2Ake21vZGVsfUNvbGxlY3Rpb25gXS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGRhdGEuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5yZWxhdGlvbnNoaXBzID0gZGF0YS5yZWxhdGlvbnNoaXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmtleXMgPSBkYXRhLmtleXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNldHRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW2Ake21vZGVsfUNvbGxlY3Rpb25gXS5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zcGxpY2UgZGF0YSBpbiBvZGVyIHRvIGFjaGlldmUgdXBkYXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdLnNwbGljZShkYXRhLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkOiAoc3RhdGUsIHsgcGF0aCwgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL3NldCBpbiBmaWVsZFxuICAgICAgICAgICAgICAgICAgICBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5LCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59Il19