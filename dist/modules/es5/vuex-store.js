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
                _this.state[_this._schema.singularize(type)] = model;
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
                    _this.query(options.queryOrExpression).then(function (data) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImNyZWF0ZSIsInJlY29yZCIsImNvbW1pdCIsImRpc3BhdGNoIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsInRoZW4iLCJkYXRhIiwiZmV0Y2hBbGxPZiIsInF1ZXJ5IiwicSIsImZpbmRSZWNvcmRzIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJyZXBsYWNlUmVjb3JkIiwiZGVsZXRlIiwicmVtb3ZlUmVjb3JkIiwidXBkYXRpbmciLCJzdG9yZSIsIm9wdGlvbnMiLCJ0cmFuc2Zvcm1Pck9wZXJhdGlvbnMiLCJ0aGVuYWJsZSIsInF1ZXJ5aW5nIiwicXVlcnlPckV4cHJlc3Npb24iLCJtdXRhdGlvbnMiLCJzZXQiLCJsYXN0SW5kZXhPZiIsImxlbmd0aCIsIml0ZW0iLCJhdHRyaWJ1dGVzIiwicmVsYXRpb25zaGlwcyIsInVwZGF0ZUZpZWxkIiwidmFsdWUiLCJpbmRleCIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsY0FBbEI7O0lBQ3FCQyxTOzs7QUFDakIseUJBQTJCO0FBQUEsWUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUFBLHFEQUN2QixrQkFBTUEsUUFBTixDQUR1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eUIsS0FBS3pCLElBQWpCO0FBQ0g7QUFDSix5QkFORDtBQU9IO0FBQ0osaUJBWlk7QUFhYnVELDZCQUFhLFVBQUN6RCxLQUFELFVBQTRCO0FBQUEsd0JBQWxCYSxJQUFrQixVQUFsQkEsSUFBa0I7QUFBQSx3QkFBWjZDLEtBQVksVUFBWkEsS0FBWTs7QUFDckM7QUFDQTdDLHlCQUFLQyxLQUFMLENBQVcsU0FBWCxFQUFzQkMsTUFBdEIsQ0FBNkIsVUFBQ0MsSUFBRCxFQUFPQyxHQUFQLEVBQVkwQyxLQUFaLEVBQW1CQyxLQUFuQixFQUE2QjtBQUN0RCw0QkFBSUEsTUFBTVAsTUFBTixLQUFpQk0sUUFBUSxDQUE3QixFQUFnQztBQUM1QjtBQUNBM0MsaUNBQUtDLEdBQUwsSUFBWXlDLEtBQVo7QUFDSDtBQUNELCtCQUFPMUMsS0FBS0MsR0FBTCxDQUFQO0FBQ0gscUJBTkQsRUFNR2pCLEtBTkg7QUFPSDtBQXRCWSxhQUFqQjtBQXdCSDtBQTlGc0I7QUErRjFCOzs7RUFoR2tDTCxLOztlQUFsQkMsUyIsImZpbGUiOiJ2dWV4LXN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZSh0eXBlKV0gPSBtb2RlbDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5wbHVyYWxpemUodHlwZSldID0gW107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vbWFwIGZpZWxkc1xuICAgICAgICAgICAgdGhpcy5nZXR0ZXJzID0ge1xuICAgICAgICAgICAgICAgIGdldEZpZWxkOiBzdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXRoID0+IHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXkpID0+IHByZXZba2V5XSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBBZGQgZmV0Y2ggc2V0dGluZ3MgbGlrZSBqc29uIGFwaVxuICAgICAgICAgICAgICAgIGNyZWF0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LmFkZFJlY29yZChyZWNvcmQpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIHJlY29yZC50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdChcInNldFwiLCB7IGRhdGE6IHJlY29yZCwgbW9kZWw6IHRoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZShyZWNvcmQudHlwZSkgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHJlbGF0aW9uc2hpcHMgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEucGx1cmFsaXplKG1vZGVsKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaEFsbFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkcyhxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZChxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hPbmU6ICh7IGNvbW1pdCB9LCB7IG1vZGVsLCBpZCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmQoeyB0eXBlOiBtb2RlbCwgaWQgfSkpLnRoZW4oZGF0YSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZShtb2RlbCkgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVwbGFjZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVtb3ZlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgZGF0YS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdGlvbnMudHJhbnNmb3JtT3JPcGVyYXRpb25zKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcXVlcnlpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KG9wdGlvbnMucXVlcnlPckV4cHJlc3Npb24pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vVE9ETzogUmVsYXRlZFJlY29yZHMgdXBkYXRlIGFuZCBkZWxldGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm11dGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZXQ6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5sYXN0SW5kZXhPZigncycpICE9PSBtb2RlbC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVt0aGlzLnNjaGVtYS5wbHVyYWxpemUobW9kZWwpXS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGRhdGEuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5yZWxhdGlvbnNoaXBzID0gZGF0YS5yZWxhdGlvbnNoaXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmtleXMgPSBkYXRhLmtleXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkOiAoc3RhdGUsIHsgcGF0aCwgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL3NldCBpbiBmaWVsZFxuICAgICAgICAgICAgICAgICAgICBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5LCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59Il19