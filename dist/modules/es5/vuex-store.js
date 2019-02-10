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
                            state[model + 'Collection'].push(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwiZ2V0dGVycyIsImdldEZpZWxkIiwicGF0aCIsInNwbGl0IiwicmVkdWNlIiwicHJldiIsImtleSIsImFjdGlvbnMiLCJjcmVhdGUiLCJyZWNvcmQiLCJjb21taXQiLCJkaXNwYXRjaCIsInVwZGF0ZSIsInQiLCJhZGRSZWNvcmQiLCJ0aGVuIiwiZGF0YSIsImZldGNoQWxsT2YiLCJxdWVyeSIsInEiLCJmaW5kUmVjb3JkcyIsImZldGNoQWxsUmVsYXRlZE9mIiwiZmluZFJlbGF0ZWRSZWNvcmRzIiwicmVsYXRpb25zaGlwIiwiZmV0Y2hSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZCIsImZldGNoT25lIiwiaWQiLCJmaW5kUmVjb3JkIiwidXBkYXRlUmVjb3JkIiwiZGVsZXRlIiwicmVtb3ZlUmVjb3JkIiwidXBkYXRpbmciLCJzdG9yZSIsIm9wdGlvbnMiLCJ0cmFuc2Zvcm1Pck9wZXJhdGlvbnMiLCJ0aGVuYWJsZSIsInF1ZXJ5aW5nIiwicXVlcnlPckV4cHJlc3Npb24iLCJtdXRhdGlvbnMiLCJyZW1vdmUiLCJsYXN0SW5kZXhPZiIsImxlbmd0aCIsImluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwic2V0IiwiZW5kc1dpdGgiLCJzZXR0ZWQiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJwdXNoIiwidXBkYXRlRmllbGQiLCJ2YWx1ZSIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsY0FBbEI7O0lBQ3FCQyxTOzs7QUFDakIseUJBQTJCO0FBQUEsWUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFB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QVgsRUFBc0JDLE1BQXRCLENBQTZCLFVBQUNDLElBQUQsRUFBT0MsR0FBUCxFQUFZcUMsS0FBWixFQUFtQlksS0FBbkIsRUFBNkI7QUFDdEQsNEJBQUlBLE1BQU1iLE1BQU4sS0FBaUJDLFFBQVEsQ0FBN0IsRUFBZ0M7QUFDNUI7QUFDQXRDLGlDQUFLQyxHQUFMLElBQVlnRCxLQUFaO0FBQ0g7QUFDRCwrQkFBT2pELEtBQUtDLEdBQUwsQ0FBUDtBQUNILHFCQU5ELEVBTUdmLEtBTkg7QUFPSDtBQTFDWSxhQUFqQjtBQTRDSDtBQTVIc0I7QUE2SDFCOzs7RUE5SGtDTCxLOztlQUFsQkMsUyIsImZpbGUiOiJ2dWV4LXN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICAvL3Npbmd1bGFyaXplZFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdHlwZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vYW5kIGEgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbYCR7dHlwZX1Db2xsZWN0aW9uYF0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQuYWRkUmVjb3JkKHJlY29yZCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgcmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YTogcmVjb3JkLCBtb2RlbDogcmVjb3JkLnR5cGUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHJlbGF0aW9uc2hpcHMgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBgJHttb2RlbH1Db2xsZWN0aW9uYCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaEFsbFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkcyhxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7IC8vbWluZCB0aGF0IHRoaXMgaXMgdGhlIHBsdXJhbGl6ZWQgdmVyc2lvblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pOyAvL3Npbmd1bGFyaXplZCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hPbmU6ICh7IGNvbW1pdCB9LCB7IG1vZGVsLCBpZCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmQoeyB0eXBlOiBtb2RlbCwgaWQgfSkpLnRoZW4oZGF0YSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IG1vZGVsIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogKHsgY29tbWl0IH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnVwZGF0ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVtb3ZlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgZGF0YS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdGlvbnMudHJhbnNmb3JtT3JPcGVyYXRpb25zKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcXVlcnlpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMucXVlcnlPckV4cHJlc3Npb24ocSk7XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vVE9ETzogUmVsYXRlZFJlY29yZHMgdXBkYXRlIGFuZCBkZWxldGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm11dGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICByZW1vdmU6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5sYXN0SW5kZXhPZigncycpICE9PSBtb2RlbC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBzdGF0ZVttb2RlbCArICdzJ10uZmluZEluZGV4KHJlY29yZCA9PiByZWNvcmQuaWQgPT0gZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbCArICdzJ10uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHN0YXRlW21vZGVsICsgJ3MnXS5maW5kSW5kZXgocmVjb3JkID0+IHJlY29yZC5pZCA9PSBkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsICsgJ3MnXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5lbmRzV2l0aChcIkNvbGxlY3Rpb25cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIGFsc28gaW4gQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbYCR7bW9kZWx9Q29sbGVjdGlvbmBdLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gZGF0YS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbGF0aW9uc2hpcHMgPSBkYXRhLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ua2V5cyA9IGRhdGEua2V5cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbYCR7bW9kZWx9Q29sbGVjdGlvbmBdLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NwbGljZSBkYXRhIGluIG9kZXIgdG8gYWNoaWV2ZSB1cGRhdGVzXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0uc3BsaWNlKGRhdGEubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlRmllbGQ6IChzdGF0ZSwgeyBwYXRoLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGluIGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=