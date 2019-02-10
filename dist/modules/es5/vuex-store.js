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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImNyZWF0ZSIsInJlY29yZCIsImNvbW1pdCIsImRpc3BhdGNoIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsInRoZW4iLCJkYXRhIiwiZmV0Y2hBbGxPZiIsInF1ZXJ5IiwicSIsImZpbmRSZWNvcmRzIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJ1cGRhdGVSZWNvcmQiLCJkZWxldGUiLCJyZW1vdmVSZWNvcmQiLCJ1cGRhdGluZyIsInN0b3JlIiwib3B0aW9ucyIsInRyYW5zZm9ybU9yT3BlcmF0aW9ucyIsInRoZW5hYmxlIiwicXVlcnlpbmciLCJxdWVyeU9yRXhwcmVzc2lvbiIsIm11dGF0aW9ucyIsInJlbW92ZSIsImxhc3RJbmRleE9mIiwibGVuZ3RoIiwiaW5kZXgiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJzZXQiLCJzZXR0ZWQiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJwdXNoIiwidXBkYXRlRmllbGQiLCJ2YWx1ZSIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsY0FBbEI7O0lBQ3FCQyxTOzs7QUFDakIseUJBQTJCO0FBQUEsWUFBZkMsUUFBZSx1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RUFBZjtBQUNBTiw4QkFBTU0sS0FBTixJQUFlcUIsSUFBZjtBQUNBM0IsOEJBQU1NLEtBQU4sRUFBYWtELE1BQWIsQ0FBb0I3QixLQUFLMEIsTUFBekI7QUFDSDtBQUNKLGlCQTlCWTtBQStCYlUsNkJBQWEsVUFBQy9ELEtBQUQsVUFBNEI7QUFBQSx3QkFBbEJhLElBQWtCLFVBQWxCQSxJQUFrQjtBQUFBLHdCQUFabUQsS0FBWSxVQUFaQSxLQUFZOztBQUNyQztBQUNBbkQseUJBQUtDLEtBQUwsQ0FBVyxTQUFYLEVBQXNCQyxNQUF0QixDQUE2QixVQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWXFDLEtBQVosRUFBbUJXLEtBQW5CLEVBQTZCO0FBQ3RELDRCQUFJQSxNQUFNWixNQUFOLEtBQWlCQyxRQUFRLENBQTdCLEVBQWdDO0FBQzVCO0FBQ0F0QyxpQ0FBS0MsR0FBTCxJQUFZK0MsS0FBWjtBQUNIO0FBQ0QsK0JBQU9oRCxLQUFLQyxHQUFMLENBQVA7QUFDSCxxQkFORCxFQU1HakIsS0FOSDtBQU9IO0FBeENZLGFBQWpCO0FBMENIO0FBeEhzQjtBQXlIMUI7OztFQTFIa0NMLEs7O2VBQWxCQyxTIiwiZmlsZSI6InZ1ZXgtc3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEucGx1cmFsaXplKHR5cGUpXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICBjcmVhdGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5hZGRSZWNvcmQocmVjb3JkKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCByZWNvcmQudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoXCJzZXRcIiwgeyBkYXRhOiByZWNvcmQsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUocmVjb3JkLnR5cGUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiByZWxhdGlvbnNoaXBzIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBhcmd1bWVudCBtb2RlbDogVGhlIG1vZGVsIGFzIHNpbmd1bGFyaXplZCBuYW1lXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxPZjogKHsgY29tbWl0IH0sIG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmRzKG1vZGVsKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZHMocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoT25lOiAoeyBjb21taXQgfSwgeyBtb2RlbCwgaWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3JkKHsgdHlwZTogbW9kZWwsIGlkIH0pKS50aGVuKGRhdGEgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUobW9kZWwpIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogKHsgY29tbWl0IH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnVwZGF0ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVtb3ZlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgZGF0YS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdGlvbnMudHJhbnNmb3JtT3JPcGVyYXRpb25zKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcXVlcnlpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMucXVlcnlPckV4cHJlc3Npb24ocSk7XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vVE9ETzogUmVsYXRlZFJlY29yZHMgdXBkYXRlIGFuZCBkZWxldGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm11dGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICByZW1vdmU6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5sYXN0SW5kZXhPZigncycpICE9PSBtb2RlbC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBzdGF0ZVttb2RlbCArICdzJ10uZmluZEluZGV4KHJlY29yZCA9PiByZWNvcmQuaWQgPT0gZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbCArICdzJ10uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHN0YXRlW21vZGVsICsgJ3MnXS5maW5kSW5kZXgocmVjb3JkID0+IHJlY29yZC5pZCA9PSBkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsICsgJ3MnXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5sYXN0SW5kZXhPZigncycpICE9PSBtb2RlbC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2V0dGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVt0aGlzLnNjaGVtYS5wbHVyYWxpemUobW9kZWwpXS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGRhdGEuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5yZWxhdGlvbnNoaXBzID0gZGF0YS5yZWxhdGlvbnNoaXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmtleXMgPSBkYXRhLmtleXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNldHRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW3RoaXMuc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCldLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0uc3BsaWNlKGRhdGEubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlRmllbGQ6IChzdGF0ZSwgeyBwYXRoLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGluIGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=