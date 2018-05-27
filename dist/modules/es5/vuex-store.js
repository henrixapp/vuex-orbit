function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import Store from '@orbit/store';

var VuexStore = function (_Store) {
    _inherits(VuexStore, _Store);

    function VuexStore() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VuexStore);

        var _this = _possibleConstructorReturn(this, _Store.call(this, settings));

        _this.namespaced = false;
        if (settings.schema) {
            //generate vuex store
            _this.state = _this.state || {};
            Object.keys(_this._schema.models).forEach(function (type) {
                var model = settings.schema.getModel(type);
                _this.state = _this.state || {};
                //add to state
                _this.state[_this._schema.singularize(type)] = null;
                _this.state[_this._schema.pluralize(type)] = [];
            });
            //map fields
            _this.getters = {
                getField: function (state) {
                    return function (path) {
                        return path.split(/[.[\]]+/).reduce(function (prev, key) {
                            return prev[key];
                        }, state);
                    };
                }
            };
            _this.actions = {
                //TODO: Add fetch settings like json api
                create: function (_ref, record) {
                    var commit = _ref.commit,
                        dispatch = _ref.dispatch;

                    _this.update(function (t) {
                        return t.addRecord(record);
                    }).then(function (data) {
                        dispatch("fetchAllOf", record.type);
                        commit("set", { data: record, model: _this._schema.singularize(record.type) });
                        //TODO: relationships 
                    });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: function (_ref2, model) {
                    var commit = _ref2.commit;

                    _this.query(function (q) {
                        return q.findRecords(model);
                    }).then(function (data) {
                        commit('set', { data: data, model: _this._schema.pluralize(model) });
                    });
                },
                fetchAllRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchRelatedOf: function (_ref4, query) {
                    var commit = _ref4.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecord(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchOne: function (_ref5, _ref6) {
                    var commit = _ref5.commit;
                    var model = _ref6.model,
                        id = _ref6.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: _this._schema.singularize(model) });
                    });
                },
                /*update: ({ commit }, data: Record) => {
                    this.update((t) => t.replaceRecord(data)).then(() =>
                        commit('set', { data, model: data.type })
                    )
                },*/
                delete: function (_ref7, data) {
                    var commit = _ref7.commit,
                        dispatch = _ref7.dispatch;

                    _this.update(function (t) {
                        return t.removeRecord(data);
                    }).then(function () {
                        //update
                        dispatch("fetchAllOf", data.type);
                    });
                },
                updating: function (store, options) {
                    _this.update(options.transformOrOperations).then(function (data) {
                        options.thenable(store, data);
                    });
                },
                querying: function (store, options) {
                    _this.query(function (q) {
                        return options.queryOrExpression(q);
                    }).then(function (data) {
                        options.thenable(store, data);
                    });
                }
                //TODO: RelatedRecords update and delete
            };
            _this.mutations = {
                set: function (state, _ref8) {
                    var data = _ref8.data,
                        model = _ref8.model;

                    state[model] = data;
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        state[_this.schema.pluralize(model)].forEach(function (item) {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                            }
                        });
                    }
                },
                updateField: function (state, _ref9) {
                    var path = _ref9.path,
                        value = _ref9.value;

                    //set in field
                    path.split(/[.[\]]+/).reduce(function (prev, key, index, array) {
                        if (array.length === index + 1) {
                            // eslint-disable-next-line no-param-reassign
                            prev[key] = value;
                        }
                        return prev[key];
                    }, state);
                }
            };
        }
        return _this;
    }

    return VuexStore;
}(Store);

export default VuexStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImNyZWF0ZSIsInJlY29yZCIsImNvbW1pdCIsImRpc3BhdGNoIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsInRoZW4iLCJkYXRhIiwiZmV0Y2hBbGxPZiIsInF1ZXJ5IiwicSIsImZpbmRSZWNvcmRzIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJkZWxldGUiLCJyZW1vdmVSZWNvcmQiLCJ1cGRhdGluZyIsInN0b3JlIiwib3B0aW9ucyIsInRyYW5zZm9ybU9yT3BlcmF0aW9ucyIsInRoZW5hYmxlIiwicXVlcnlpbmciLCJxdWVyeU9yRXhwcmVzc2lvbiIsIm11dGF0aW9ucyIsInNldCIsImxhc3RJbmRleE9mIiwibGVuZ3RoIiwiaXRlbSIsImF0dHJpYnV0ZXMiLCJyZWxhdGlvbnNoaXBzIiwidXBkYXRlRmllbGQiLCJ2YWx1ZSIsImluZGV4IiwiYXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxNQUFrQixjQUFsQjs7SUFDcUJDLFM7OztBQUNqQix5QkFBMkI7QUFBQSxZQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEscURBQ3ZCLGtCQUFNQSxRQUFOLENBRHVCOztBQUV2QixjQUFLQyxV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QW1CQyxLQUFuQixFQUE2QjtBQUN0RCw0QkFBSUEsTUFBTVAsTUFBTixLQUFpQk0sUUFBUSxDQUE3QixFQUFnQztBQUM1QjtBQUNBMUMsaUNBQUtDLEdBQUwsSUFBWXdDLEtBQVo7QUFDSDtBQUNELCtCQUFPekMsS0FBS0MsR0FBTCxDQUFQO0FBQ0gscUJBTkQsRUFNR2pCLEtBTkg7QUFPSDtBQXRCWSxhQUFqQjtBQXdCSDtBQWxHc0I7QUFtRzFCOzs7RUFwR2tDTCxLOztlQUFsQkMsUyIsImZpbGUiOiJ2dWV4LXN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZSh0eXBlKV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4gcHJldltrZXldLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQuYWRkUmVjb3JkKHJlY29yZCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgcmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YTogcmVjb3JkLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHJlY29yZC50eXBlKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogcmVsYXRpb25zaGlwcyBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6ICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5wbHVyYWxpemUobW9kZWwpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKG1vZGVsKSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKnVwZGF0ZTogKHsgY29tbWl0IH0sIGRhdGE6IFJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgodCkgPT4gdC5yZXBsYWNlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSwqL1xuICAgICAgICAgICAgICAgIGRlbGV0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0aW9ucy50cmFuc2Zvcm1Pck9wZXJhdGlvbnMpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeWluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5xdWVyeU9yRXhwcmVzc2lvbihxKTtcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNldDogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmxhc3RJbmRleE9mKCdzJykgIT09IG1vZGVsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW3RoaXMuc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCldLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gZGF0YS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbGF0aW9uc2hpcHMgPSBkYXRhLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ua2V5cyA9IGRhdGEua2V5cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlRmllbGQ6IChzdGF0ZSwgeyBwYXRoLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGluIGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=