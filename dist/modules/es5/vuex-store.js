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
                create: async function (_ref, record) {
                    var commit = _ref.commit;

                    var data = await _this.update(function (t) {
                        return t.addRecord(record);
                    });
                    commit("set", { data: record, model: record.type });
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

                    //TODO: singularize
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
                    if (!model.endsWith("Collection")) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwiZ2V0dGVycyIsImdldEZpZWxkIiwicGF0aCIsInNwbGl0IiwicmVkdWNlIiwicHJldiIsImtleSIsImFjdGlvbnMiLCJjcmVhdGUiLCJyZWNvcmQiLCJjb21taXQiLCJkYXRhIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsImZldGNoQWxsT2YiLCJxdWVyeSIsInEiLCJmaW5kUmVjb3JkcyIsInRoZW4iLCJmZXRjaEFsbFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkcyIsInJlbGF0aW9uc2hpcCIsImZldGNoUmVsYXRlZE9mIiwiZmluZFJlbGF0ZWRSZWNvcmQiLCJmZXRjaE9uZSIsImlkIiwiZmluZFJlY29yZCIsInVwZGF0ZVJlY29yZCIsImRlbGV0ZSIsImRpc3BhdGNoIiwicmVtb3ZlUmVjb3JkIiwidXBkYXRpbmciLCJzdG9yZSIsIm9wdGlvbnMiLCJ0cmFuc2Zvcm1Pck9wZXJhdGlvbnMiLCJ0aGVuYWJsZSIsInF1ZXJ5aW5nIiwicXVlcnlPckV4cHJlc3Npb24iLCJtdXRhdGlvbnMiLCJyZW1vdmUiLCJsYXN0SW5kZXhPZiIsImxlbmd0aCIsImluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwic2V0IiwiZW5kc1dpdGgiLCJzZXR0ZWQiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJwdXNoIiwidXBkYXRlRmllbGQiLCJ2YWx1ZSIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsY0FBbEI7O0lBQ3FCQyxTOzs7QUFDakIseUJBQTJCO0FBQUEsWUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFB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QlksS0FBbkIsRUFBNkI7QUFDdEQsNEJBQUlBLE1BQU1iLE1BQU4sS0FBaUJDLFFBQVEsQ0FBN0IsRUFBZ0M7QUFDNUI7QUFDQXRDLGlDQUFLQyxHQUFMLElBQVlnRCxLQUFaO0FBQ0g7QUFDRCwrQkFBT2pELEtBQUtDLEdBQUwsQ0FBUDtBQUNILHFCQU5ELEVBTUdmLEtBTkg7QUFPSDtBQTNDWSxhQUFqQjtBQTZDSDtBQTFIc0I7QUEySDFCOzs7RUE1SGtDTCxLOztlQUFsQkMsUyIsImZpbGUiOiJ2dWV4LXN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICAvL3Npbmd1bGFyaXplZFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdHlwZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vYW5kIGEgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbYCR7dHlwZX1Db2xsZWN0aW9uYF0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBhc3luYyAoeyBjb21taXQgfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgdGhpcy51cGRhdGUodCA9PiB0LmFkZFJlY29yZChyZWNvcmQpKTtcbiAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YTogcmVjb3JkLCBtb2RlbDogcmVjb3JkLnR5cGUgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6ICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGAke21vZGVsfUNvbGxlY3Rpb25gIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTsgLy9taW5kIHRoYXQgdGhpcyBpcyB0aGUgcGx1cmFsaXplZCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZChxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7IC8vc2luZ3VsYXJpemVkIHZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogbW9kZWwgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQudXBkYXRlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0aW9ucy50cmFuc2Zvcm1Pck9wZXJhdGlvbnMpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeWluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5xdWVyeU9yRXhwcmVzc2lvbihxKTtcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHJlbW92ZTogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBzaW5ndWxhcml6ZVxuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gc3RhdGVbbW9kZWwgKyAncyddLmZpbmRJbmRleChyZWNvcmQgPT4gcmVjb3JkLmlkID09IGRhdGEuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWwgKyAncyddLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBzdGF0ZVttb2RlbCArICdzJ10uZmluZEluZGV4KHJlY29yZCA9PiByZWNvcmQuaWQgPT0gZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbCArICdzJ10uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZGVsLmVuZHNXaXRoKFwiQ29sbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGUgYWxzbyBpbiBDb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2V0dGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVtgJHttb2RlbH1Db2xsZWN0aW9uYF0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVtgJHttb2RlbH1Db2xsZWN0aW9uYF0ucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BsaWNlIGRhdGEgaW4gb2RlciB0byBhY2hpZXZlIHVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXS5zcGxpY2UoZGF0YS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==