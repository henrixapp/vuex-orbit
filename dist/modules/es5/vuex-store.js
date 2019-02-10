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
                //singularized
                _this.state[type] = null;
                //and a collection
                _this.state[type + 'Collection'] = [];
            });
            //map fields
            _this.getters = {
                getField: function (state) {
                    return function (path) {
                        return path.split(/[.[\]]+/).reduce(function (prev, key) {
                            if (prev != null) {
                                return prev[key];
                            } else {
                                return null;
                            }
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
                        // dispatch("fetchAllOf", record.type);
                        commit("set", { data: record, model: record.type });
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
                        commit('set', { data: data, model: model + 'Collection' });
                    });
                },
                fetchAllRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship }); //mind that this is the pluralized version
                    });
                },
                fetchRelatedOf: function (_ref4, query) {
                    var commit = _ref4.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecord(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship }); //singularized version
                    });
                },
                fetchOne: function (_ref5, _ref6) {
                    var commit = _ref5.commit;
                    var model = _ref6.model,
                        id = _ref6.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: model });
                    });
                },
                update: function (_ref7, data) {
                    var commit = _ref7.commit;

                    _this.update(function (t) {
                        return t.updateRecord(data);
                    }).then(function () {
                        return commit('set', { data: data, model: data.type });
                    });
                },
                delete: function (_ref8, data) {
                    var commit = _ref8.commit,
                        dispatch = _ref8.dispatch;

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
                remove: function (state, _ref9) {
                    var data = _ref9.data,
                        model = _ref9.model;

                    if (model.lastIndexOf('s') !== model.length - 1) {
                        var index = state[model + 's'].findIndex(function (record) {
                            return record.id == data.id;
                        });
                        state[model + 's'].splice(index, 1);
                    } else {
                        var _index = state[model + 's'].findIndex(function (record) {
                            return record.id == data.id;
                        });
                        state[model + 's'].splice(_index, 1);
                    }
                },
                set: function (state, _ref10) {
                    var data = _ref10.data,
                        model = _ref10.model;

                    state[model] = data;
                    if (model.endsWith("Collection")) {
                        //update also in Collection
                        var setted = false;
                        state[model + 'Collection'].forEach(function (item) {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                                setted = true;
                            }
                        });
                        if (!setted) {
                            state[_this.schema.pluralize(model)].push(data);
                        }
                    } else {
                        //splice data in oder to achieve updates
                        state[model] = [];
                        state[model] = data;
                        state[model].splice(data.length);
                    }
                },
                updateField: function (state, _ref11) {
                    var path = _ref11.path,
                        value = _ref11.value;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwiZ2V0dGVycyIsImdldEZpZWxkIiwicGF0aCIsInNwbGl0IiwicmVkdWNlIiwicHJldiIsImtleSIsImFjdGlvbnMiLCJjcmVhdGUiLCJyZWNvcmQiLCJjb21taXQiLCJkaXNwYXRjaCIsInVwZGF0ZSIsInQiLCJhZGRSZWNvcmQiLCJ0aGVuIiwiZGF0YSIsImZldGNoQWxsT2YiLCJxdWVyeSIsInEiLCJmaW5kUmVjb3JkcyIsImZldGNoQWxsUmVsYXRlZE9mIiwiZmluZFJlbGF0ZWRSZWNvcmRzIiwicmVsYXRpb25zaGlwIiwiZmV0Y2hSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZCIsImZldGNoT25lIiwiaWQiLCJmaW5kUmVjb3JkIiwidXBkYXRlUmVjb3JkIiwiZGVsZXRlIiwicmVtb3ZlUmVjb3JkIiwidXBkYXRpbmciLCJzdG9yZSIsIm9wdGlvbnMiLCJ0cmFuc2Zvcm1Pck9wZXJhdGlvbnMiLCJ0aGVuYWJsZSIsInF1ZXJ5aW5nIiwicXVlcnlPckV4cHJlc3Npb24iLCJtdXRhdGlvbnMiLCJyZW1vdmUiLCJsYXN0SW5kZXhPZiIsImxlbmd0aCIsImluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwic2V0IiwiZW5kc1dpdGgiLCJzZXR0ZWQiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJwbHVyYWxpemUiLCJwdXNoIiwidXBkYXRlRmllbGQiLCJ2YWx1ZSIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsY0FBbEI7O0lBQ3FCQyxTOzs7QUFDakIseUJBQTJCO0FBQUEsWUFBZkMsUUFBZSx1RUFB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QVksVUFBWkEsS0FBWTs7QUFDckM7QUFDQXJELHlCQUFLQyxLQUFMLENBQVcsU0FBWCxFQUFzQkMsTUFBdEIsQ0FBNkIsVUFBQ0MsSUFBRCxFQUFPQyxHQUFQLEVBQVlxQyxLQUFaLEVBQW1CYSxLQUFuQixFQUE2QjtBQUN0RCw0QkFBSUEsTUFBTWQsTUFBTixLQUFpQkMsUUFBUSxDQUE3QixFQUFnQztBQUM1QjtBQUNBdEMsaUNBQUtDLEdBQUwsSUFBWWlELEtBQVo7QUFDSDtBQUNELCtCQUFPbEQsS0FBS0MsR0FBTCxDQUFQO0FBQ0gscUJBTkQsRUFNR2YsS0FOSDtBQU9IO0FBMUNZLGFBQWpCO0FBNENIO0FBNUhzQjtBQTZIMUI7OztFQTlIa0NMLEs7O2VBQWxCQyxTIiwiZmlsZSI6InZ1ZXgtc3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIC8vc2luZ3VsYXJpemVkXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0eXBlXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgLy9hbmQgYSBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVtgJHt0eXBlfUNvbGxlY3Rpb25gXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICBjcmVhdGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5hZGRSZWNvcmQocmVjb3JkKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCByZWNvcmQudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoXCJzZXRcIiwgeyBkYXRhOiByZWNvcmQsIG1vZGVsOiByZWNvcmQudHlwZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogcmVsYXRpb25zaGlwcyBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6ICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGAke21vZGVsfUNvbGxlY3Rpb25gIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTsgLy9taW5kIHRoYXQgdGhpcyBpcyB0aGUgcGx1cmFsaXplZCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZChxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7IC8vc2luZ3VsYXJpemVkIHZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogbW9kZWwgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQudXBkYXRlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0aW9ucy50cmFuc2Zvcm1Pck9wZXJhdGlvbnMpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeWluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5xdWVyeU9yRXhwcmVzc2lvbihxKTtcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHJlbW92ZTogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmxhc3RJbmRleE9mKCdzJykgIT09IG1vZGVsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHN0YXRlW21vZGVsICsgJ3MnXS5maW5kSW5kZXgocmVjb3JkID0+IHJlY29yZC5pZCA9PSBkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsICsgJ3MnXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gc3RhdGVbbW9kZWwgKyAncyddLmZpbmRJbmRleChyZWNvcmQgPT4gcmVjb3JkLmlkID09IGRhdGEuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWwgKyAncyddLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldDogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmVuZHNXaXRoKFwiQ29sbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGUgYWxzbyBpbiBDb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2V0dGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVtgJHttb2RlbH1Db2xsZWN0aW9uYF0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVt0aGlzLnNjaGVtYS5wbHVyYWxpemUobW9kZWwpXS5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zcGxpY2UgZGF0YSBpbiBvZGVyIHRvIGFjaGlldmUgdXBkYXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdLnNwbGljZShkYXRhLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkOiAoc3RhdGUsIHsgcGF0aCwgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL3NldCBpbiBmaWVsZFxuICAgICAgICAgICAgICAgICAgICBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5LCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59Il19