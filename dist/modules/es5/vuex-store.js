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
                    commit("set", { data: data, model: data.type });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: async function (_ref2, model) {
                    var commit = _ref2.commit;

                    var data = await _this.query(function (q) {
                        return q.findRecords(model);
                    });
                    commit('set', { data: data, model: model + 'Collection' });
                },
                fetchAllRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: _this.schema.singularize(query.relationship) + 'Collection' }); //mind that this is the pluralized version
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
                update: async function (_ref7, record) {
                    var commit = _ref7.commit;

                    var data = await _this.update(function (t) {
                        return t.updateRecord(record);
                    });
                    commit('set', { data: data, model: data.type });
                },
                delete: async function (_ref8, data) {
                    var commit = _ref8.commit,
                        dispatch = _ref8.dispatch;

                    await _this.update(function (t) {
                        return t.removeRecord(data);
                    });
                    await dispatch("fetchAllOf", data.type);
                    commit('set', { data: null, model: data.type });
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
                set: function (state, _ref9) {
                    var data = _ref9.data,
                        model = _ref9.model;

                    state[model] = data;
                    if (data === null) {
                        return;
                    }
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
                updateField: function (state, _ref10) {
                    var path = _ref10.path,
                        value = _ref10.value;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwiZ2V0dGVycyIsImdldEZpZWxkIiwicGF0aCIsInNwbGl0IiwicmVkdWNlIiwicHJldiIsImtleSIsImFjdGlvbnMiLCJjcmVhdGUiLCJyZWNvcmQiLCJjb21taXQiLCJkYXRhIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsImZldGNoQWxsT2YiLCJxdWVyeSIsInEiLCJmaW5kUmVjb3JkcyIsImZldGNoQWxsUmVsYXRlZE9mIiwiZmluZFJlbGF0ZWRSZWNvcmRzIiwicmVsYXRpb25zaGlwIiwidGhlbiIsInNpbmd1bGFyaXplIiwiZmV0Y2hSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZCIsImZldGNoT25lIiwiaWQiLCJmaW5kUmVjb3JkIiwidXBkYXRlUmVjb3JkIiwiZGVsZXRlIiwiZGlzcGF0Y2giLCJyZW1vdmVSZWNvcmQiLCJ1cGRhdGluZyIsInN0b3JlIiwib3B0aW9ucyIsInRyYW5zZm9ybU9yT3BlcmF0aW9ucyIsInRoZW5hYmxlIiwicXVlcnlpbmciLCJxdWVyeU9yRXhwcmVzc2lvbiIsIm11dGF0aW9ucyIsInNldCIsImVuZHNXaXRoIiwic2V0dGVkIiwiaXRlbSIsImF0dHJpYnV0ZXMiLCJyZWxhdGlvbnNoaXBzIiwicHVzaCIsInNwbGljZSIsImxlbmd0aCIsInVwZGF0ZUZpZWxkIiwidmFsdWUiLCJpbmRleCIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsY0FBbEI7O0lBQ3FCQyxTOzs7QUFDakIseUJBQTJCO0FBQUEsWUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUFBLHFEQUN2QixrQkFBTUEs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QUFJLENBQUNBLE1BQUwsRUFBYTtBQUNUcEQsa0NBQVNNLEtBQVQsaUJBQTRCa0QsSUFBNUIsQ0FBaUNwQyxJQUFqQztBQUNIO0FBQ0oscUJBZEQsTUFjTztBQUNIO0FBQ0FwQiw4QkFBTU0sS0FBTixJQUFlLEVBQWY7QUFDQU4sOEJBQU1NLEtBQU4sSUFBZWMsSUFBZjtBQUNBcEIsOEJBQU1NLEtBQU4sRUFBYW1ELE1BQWIsQ0FBb0JyQyxLQUFLc0MsTUFBekI7QUFDSDtBQUNKLGlCQTFCWTtBQTJCYkMsNkJBQWEsVUFBQzNELEtBQUQsVUFBNEI7QUFBQSx3QkFBbEJXLElBQWtCLFVBQWxCQSxJQUFrQjtBQUFBLHdCQUFaaUQsS0FBWSxVQUFaQSxLQUFZOztBQUNyQztBQUNBakQseUJBQUtDLEtBQUwsQ0FBVyxTQUFYLEVBQXNCQyxNQUF0QixDQUE2QixVQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWThDLEtBQVosRUFBbUJDLEtBQW5CLEVBQTZCO0FBQ3RELDRCQUFJQSxNQUFNSixNQUFOLEtBQWlCRyxRQUFRLENBQTdCLEVBQWdDO0FBQzVCO0FBQ0EvQyxpQ0FBS0MsR0FBTCxJQUFZNkMsS0FBWjtBQUNIO0FBQ0QsK0JBQU85QyxLQUFLQyxHQUFMLENBQVA7QUFDSCxxQkFORCxFQU1HZixLQU5IO0FBT0g7QUFwQ1ksYUFBakI7QUFzQ0g7QUFsSHNCO0FBbUgxQjs7O0VBcEhrQ0wsSzs7ZUFBbEJDLFMiLCJmaWxlIjoidnVleC1zdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdG9yZSBmcm9tICdAb3JiaXQvc3RvcmUnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVnVleFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLm5hbWVzcGFjZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHNldHRpbmdzLnNjaGVtYSkge1xuICAgICAgICAgICAgLy9nZW5lcmF0ZSB2dWV4IHN0b3JlXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gc2V0dGluZ3Muc2NoZW1hLmdldE1vZGVsKHR5cGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgICAgIC8vYWRkIHRvIHN0YXRlXG4gICAgICAgICAgICAgICAgLy9zaW5ndWxhcml6ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3R5cGVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAvL2FuZCBhIGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW2Ake3R5cGV9Q29sbGVjdGlvbmBdID0gW107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vbWFwIGZpZWxkc1xuICAgICAgICAgICAgdGhpcy5nZXR0ZXJzID0ge1xuICAgICAgICAgICAgICAgIGdldEZpZWxkOiBzdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXRoID0+IHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldltrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBBZGQgZmV0Y2ggc2V0dGluZ3MgbGlrZSBqc29uIGFwaVxuICAgICAgICAgICAgICAgIGNyZWF0ZTogYXN5bmMgKHsgY29tbWl0IH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IGF3YWl0IHRoaXMudXBkYXRlKHQgPT4gdC5hZGRSZWNvcmQocmVjb3JkKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1pdChcInNldFwiLCB7IGRhdGEsIG1vZGVsOiBkYXRhLnR5cGUgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6IGFzeW5jICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IGF3YWl0IHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmRzKG1vZGVsKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogYCR7bW9kZWx9Q29sbGVjdGlvbmAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaEFsbFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkcyhxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBgJHt0aGlzLnNjaGVtYS5zaW5ndWxhcml6ZShxdWVyeS5yZWxhdGlvbnNoaXApfUNvbGxlY3Rpb25gIH0pOyAvL21pbmQgdGhhdCB0aGlzIGlzIHRoZSBwbHVyYWxpemVkIHZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTsgLy9zaW5ndWxhcml6ZWQgdmVyc2lvblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoT25lOiAoeyBjb21taXQgfSwgeyBtb2RlbCwgaWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3JkKHsgdHlwZTogbW9kZWwsIGlkIH0pKS50aGVuKGRhdGEgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBtb2RlbCB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGFzeW5jICh7IGNvbW1pdCB9LCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCB0aGlzLnVwZGF0ZSh0ID0+IHQudXBkYXRlUmVjb3JkKHJlY29yZCkpO1xuICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZTogYXN5bmMgKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgZGF0YS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGE6IG51bGwsIG1vZGVsOiBkYXRhLnR5cGUgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdGlvbnMudHJhbnNmb3JtT3JPcGVyYXRpb25zKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcXVlcnlpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMucXVlcnlPckV4cHJlc3Npb24ocSk7XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vVE9ETzogUmVsYXRlZFJlY29yZHMgdXBkYXRlIGFuZCBkZWxldGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm11dGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZXQ6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2RlbC5lbmRzV2l0aChcIkNvbGxlY3Rpb25cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIGFsc28gaW4gQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbYCR7bW9kZWx9Q29sbGVjdGlvbmBdLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gZGF0YS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbGF0aW9uc2hpcHMgPSBkYXRhLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ua2V5cyA9IGRhdGEua2V5cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbYCR7bW9kZWx9Q29sbGVjdGlvbmBdLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NwbGljZSBkYXRhIGluIG9kZXIgdG8gYWNoaWV2ZSB1cGRhdGVzXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0uc3BsaWNlKGRhdGEubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlRmllbGQ6IChzdGF0ZSwgeyBwYXRoLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGluIGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=