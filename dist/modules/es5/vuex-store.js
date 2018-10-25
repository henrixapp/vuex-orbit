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
                update: function (_ref7, data) {
                    var commit = _ref7.commit;

                    _this.update(function (t) {
                        return t.replaceRecord(data);
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
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        var setted = false;
                        state[_this.schema.pluralize(model)].forEach(function (item) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImNyZWF0ZSIsInJlY29yZCIsImNvbW1pdCIsImRpc3BhdGNoIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsInRoZW4iLCJkYXRhIiwiZmV0Y2hBbGxPZiIsInF1ZXJ5IiwicSIsImZpbmRSZWNvcmRzIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJyZXBsYWNlUmVjb3JkIiwiZGVsZXRlIiwicmVtb3ZlUmVjb3JkIiwidXBkYXRpbmciLCJzdG9yZSIsIm9wdGlvbnMiLCJ0cmFuc2Zvcm1Pck9wZXJhdGlvbnMiLCJ0aGVuYWJsZSIsInF1ZXJ5aW5nIiwicXVlcnlPckV4cHJlc3Npb24iLCJtdXRhdGlvbnMiLCJyZW1vdmUiLCJsYXN0SW5kZXhPZiIsImxlbmd0aCIsImluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwic2V0Iiwic2V0dGVkIiwiaXRlbSIsImF0dHJpYnV0ZXMiLCJyZWxhdGlvbnNoaXBzIiwicHVzaCIsInVwZGF0ZUZpZWxkIiwidmFsdWUiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLGNBQWxCOztJQUNxQkMsUzs7O0FBQ2pCLHlCQUEyQjtBQUFBLFlBQWZDLFFBQWUs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QWUsRUFBZjtBQUNBTiw4QkFBTU0sS0FBTixJQUFlcUIsSUFBZjtBQUNBM0IsOEJBQU1NLEtBQU4sRUFBYWtELE1BQWIsQ0FBb0I3QixLQUFLMEIsTUFBekI7QUFDSDtBQUNKLGlCQTlCWTtBQStCYlUsNkJBQWEsVUFBQy9ELEtBQUQsVUFBNEI7QUFBQSx3QkFBbEJhLElBQWtCLFVBQWxCQSxJQUFrQjtBQUFBLHdCQUFabUQsS0FBWSxVQUFaQSxLQUFZOztBQUNyQztBQUNBbkQseUJBQUtDLEtBQUwsQ0FBVyxTQUFYLEVBQXNCQyxNQUF0QixDQUE2QixVQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWXFDLEtBQVosRUFBbUJXLEtBQW5CLEVBQTZCO0FBQ3RELDRCQUFJQSxNQUFNWixNQUFOLEtBQWlCQyxRQUFRLENBQTdCLEVBQWdDO0FBQzVCO0FBQ0F0QyxpQ0FBS0MsR0FBTCxJQUFZK0MsS0FBWjtBQUNIO0FBQ0QsK0JBQU9oRCxLQUFLQyxHQUFMLENBQVA7QUFDSCxxQkFORCxFQU1HakIsS0FOSDtBQU9IO0FBeENZLGFBQWpCO0FBMENIO0FBeEhzQjtBQXlIMUI7OztFQTFIa0NMLEs7O2VBQWxCQyxTIiwiZmlsZSI6InZ1ZXgtc3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEucGx1cmFsaXplKHR5cGUpXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICBjcmVhdGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5hZGRSZWNvcmQocmVjb3JkKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCByZWNvcmQudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoXCJzZXRcIiwgeyBkYXRhOiByZWNvcmQsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUocmVjb3JkLnR5cGUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiByZWxhdGlvbnNoaXBzIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBhcmd1bWVudCBtb2RlbDogVGhlIG1vZGVsIGFzIHNpbmd1bGFyaXplZCBuYW1lXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxPZjogKHsgY29tbWl0IH0sIG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmRzKG1vZGVsKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZHMocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoT25lOiAoeyBjb21taXQgfSwgeyBtb2RlbCwgaWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3JkKHsgdHlwZTogbW9kZWwsIGlkIH0pKS50aGVuKGRhdGEgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUobW9kZWwpIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogKHsgY29tbWl0IH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlcGxhY2VSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBkYXRhLnR5cGUgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVsZXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlbW92ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIGRhdGEudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShvcHRpb25zLnRyYW5zZm9ybU9yT3BlcmF0aW9ucykudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLnF1ZXJ5T3JFeHByZXNzaW9uKHEpO1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL1RPRE86IFJlbGF0ZWRSZWNvcmRzIHVwZGF0ZSBhbmQgZGVsZXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlOiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gc3RhdGVbbW9kZWwgKyAncyddLmZpbmRJbmRleChyZWNvcmQgPT4gcmVjb3JkLmlkID09IGRhdGEuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWwgKyAncyddLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBzdGF0ZVttb2RlbCArICdzJ10uZmluZEluZGV4KHJlY29yZCA9PiByZWNvcmQuaWQgPT0gZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbCArICdzJ10uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVt0aGlzLnNjaGVtYS5wbHVyYWxpemUobW9kZWwpXS5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdLnNwbGljZShkYXRhLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkOiAoc3RhdGUsIHsgcGF0aCwgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL3NldCBpbiBmaWVsZFxuICAgICAgICAgICAgICAgICAgICBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5LCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59Il19