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
                this.state[this._schema.singularize(type)] = model;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwibmFtZXNwYWNlZCIsInNjaGVtYSIsInN0YXRlIiwiT2JqZWN0Iiwia2V5cyIsIl9zY2hlbWEiLCJtb2RlbHMiLCJmb3JFYWNoIiwidHlwZSIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJzaW5ndWxhcml6ZSIsInBsdXJhbGl6ZSIsImdldHRlcnMiLCJnZXRGaWVsZCIsInBhdGgiLCJzcGxpdCIsInJlZHVjZSIsInByZXYiLCJrZXkiLCJhY3Rpb25zIiwiY3JlYXRlIiwiY29tbWl0IiwiZGlzcGF0Y2giLCJyZWNvcmQiLCJ1cGRhdGUiLCJ0IiwiYWRkUmVjb3JkIiwidGhlbiIsImRhdGEiLCJmZXRjaEFsbE9mIiwicXVlcnkiLCJxIiwiZmluZFJlY29yZHMiLCJmZXRjaEFsbFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkcyIsInJlbGF0aW9uc2hpcCIsImZldGNoUmVsYXRlZE9mIiwiZmluZFJlbGF0ZWRSZWNvcmQiLCJmZXRjaE9uZSIsImlkIiwiZmluZFJlY29yZCIsImRlbGV0ZSIsInJlbW92ZVJlY29yZCIsInVwZGF0aW5nIiwic3RvcmUiLCJvcHRpb25zIiwidHJhbnNmb3JtT3JPcGVyYXRpb25zIiwidGhlbmFibGUiLCJxdWVyeWluZyIsInF1ZXJ5T3JFeHByZXNzaW9uIiwibXV0YXRpb25zIiwic2V0IiwibGFzdEluZGV4T2YiLCJsZW5ndGgiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJ1cGRhdGVGaWVsZCIsInZhbHVlIiwiaW5kZXgiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUNlLE1BQU1BLFNBQU4sU0FBd0JDLGVBQXhCLENBQThCO0FBQ3pDQyxnQkFBWUMsV0FBVyxFQUF2QixFQUEyQjtBQUN2QixjQUFNQSxRQUFOO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQixLQUFs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QVIsS0FBNEI7QUFDN0JQLDBCQUFNTyxLQUFOLElBQWVvQixJQUFmO0FBQ0Esd0JBQUlwQixNQUFNNEMsV0FBTixDQUFrQixHQUFsQixNQUEyQjVDLE1BQU02QyxNQUFOLEdBQWUsQ0FBOUMsRUFBaUQ7QUFDN0NwRCw4QkFBTSxLQUFLRCxNQUFMLENBQVlXLFNBQVosQ0FBc0JILEtBQXRCLENBQU4sRUFBb0NGLE9BQXBDLENBQTRDZ0QsUUFBUTtBQUNoRCxnQ0FBSUEsS0FBS2YsRUFBTCxLQUFZWCxLQUFLVyxFQUFyQixFQUF5QjtBQUNyQmUscUNBQUtDLFVBQUwsR0FBa0IzQixLQUFLMkIsVUFBdkI7QUFDQUQscUNBQUtFLGFBQUwsR0FBcUI1QixLQUFLNEIsYUFBMUI7QUFDQUYscUNBQUtuRCxJQUFMLEdBQVl5QixLQUFLekIsSUFBakI7QUFDSDtBQUNKLHlCQU5EO0FBT0g7QUFDSixpQkFaWTtBQWFic0QsNkJBQWEsQ0FBQ3hELEtBQUQsRUFBUSxFQUFFYSxJQUFGLEVBQVE0QyxLQUFSLEVBQVIsS0FBNEI7QUFDckM7QUFDQTVDLHlCQUFLQyxLQUFMLENBQVcsU0FBWCxFQUFzQkMsTUFBdEIsQ0FBNkIsQ0FBQ0MsSUFBRCxFQUFPQyxHQUFQLEVBQVl5QyxLQUFaLEVBQW1CQyxLQUFuQixLQUE2QjtBQUN0RCw0QkFBSUEsTUFBTVAsTUFBTixLQUFpQk0sUUFBUSxDQUE3QixFQUFnQztBQUM1QjtBQUNBMUMsaUNBQUtDLEdBQUwsSUFBWXdDLEtBQVo7QUFDSDtBQUNELCtCQUFPekMsS0FBS0MsR0FBTCxDQUFQO0FBQ0gscUJBTkQsRUFNR2pCLEtBTkg7QUFPSDtBQXRCWSxhQUFqQjtBQXdCSDtBQUNKO0FBcEd3QztrQkFBeEJOLFMiLCJmaWxlIjoidnVleC1zdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdG9yZSBmcm9tICdAb3JiaXQvc3RvcmUnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVnVleFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLm5hbWVzcGFjZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHNldHRpbmdzLnNjaGVtYSkge1xuICAgICAgICAgICAgLy9nZW5lcmF0ZSB2dWV4IHN0b3JlXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gc2V0dGluZ3Muc2NoZW1hLmdldE1vZGVsKHR5cGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgICAgIC8vYWRkIHRvIHN0YXRlXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUodHlwZSldID0gbW9kZWw7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEucGx1cmFsaXplKHR5cGUpXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiBwcmV2W2tleV0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICBjcmVhdGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5hZGRSZWNvcmQocmVjb3JkKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCByZWNvcmQudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoXCJzZXRcIiwgeyBkYXRhOiByZWNvcmQsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUocmVjb3JkLnR5cGUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiByZWxhdGlvbnNoaXBzIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBhcmd1bWVudCBtb2RlbDogVGhlIG1vZGVsIGFzIHNpbmd1bGFyaXplZCBuYW1lXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxPZjogKHsgY29tbWl0IH0sIG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmRzKG1vZGVsKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZHMocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoT25lOiAoeyBjb21taXQgfSwgeyBtb2RlbCwgaWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3JkKHsgdHlwZTogbW9kZWwsIGlkIH0pKS50aGVuKGRhdGEgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUobW9kZWwpIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YTogUmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCh0KSA9PiB0LnJlcGxhY2VSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9LCovXG4gICAgICAgICAgICAgICAgZGVsZXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlbW92ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIGRhdGEudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShvcHRpb25zLnRyYW5zZm9ybU9yT3BlcmF0aW9ucykudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLnF1ZXJ5T3JFeHByZXNzaW9uKHEpO1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL1RPRE86IFJlbGF0ZWRSZWNvcmRzIHVwZGF0ZSBhbmQgZGVsZXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==