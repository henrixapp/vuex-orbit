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
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: function (_ref, model) {
                    var commit = _ref.commit;

                    _this.query(function (q) {
                        return q.findRecords(model);
                    }).then(function (data) {
                        commit('set', { data: data, model: _this._schema.pluralize(model) });
                    });
                },
                fetchAllRelatedOf: function (_ref2, query) {
                    var commit = _ref2.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecord(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchOne: function (_ref4, _ref5) {
                    var commit = _ref4.commit;
                    var model = _ref5.model,
                        id = _ref5.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: _this._schema.singularize(model) });
                    });
                },
                update: function (_ref6, data) {
                    var commit = _ref6.commit;

                    _this.update(function (t) {
                        return t.replaceRecord(data);
                    }).then(function () {
                        return commit('set', { data: data, model: data.type });
                    });
                },
                delete: function (_ref7, data) {
                    var commit = _ref7.commit,
                        dispatch = _ref7.dispatch;

                    _this.update(function (t) {
                        return t.removeRecord(data);
                    }).then(function () {
                        //update
                        dispatch("fetchAllOf", data.type);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImZldGNoQWxsT2YiLCJjb21taXQiLCJxdWVyeSIsInEiLCJmaW5kUmVjb3JkcyIsInRoZW4iLCJkYXRhIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJ1cGRhdGUiLCJ0IiwicmVwbGFjZVJlY29yZCIsImRlbGV0ZSIsImRpc3BhdGNoIiwicmVtb3ZlUmVjb3JkIiwibXV0YXRpb25zIiwic2V0IiwibGFzdEluZGV4T2YiLCJsZW5ndGgiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJ1cGRhdGVGaWVsZCIsInZhbHVlIiwiaW5kZXgiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLGNBQWxCOztJQUNxQkMsUzs7O0FBQ2pCLHlCQUEyQjtBQUFBLFlBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxxREFDdkIsa0JBQU1BLFFBQU4sQ0FEdUI7O0FBRXZCLGNBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxZQUFJRCxTQUFTRSxNQUFiLEVBQXFCO0FBQ2pCO0FBQ0Esa0JBQUtDLEtBQUwsR0FBYSxNQUFLQSxLQUFMLElBQWMsRUFBM0I7QUFDQUMsbUJBQU9DLElB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QUwsR0FBcUJyQixLQUFLcUIsYUFBMUI7QUFDQUYscUNBQUsxQyxJQUFMLEdBQVl1QixLQUFLdkIsSUFBakI7QUFDSDtBQUNKLHlCQU5EO0FBT0g7QUFDSixpQkFaWTtBQWFiNkMsNkJBQWEsVUFBQy9DLEtBQUQsU0FBNEI7QUFBQSx3QkFBbEJhLElBQWtCLFNBQWxCQSxJQUFrQjtBQUFBLHdCQUFabUMsS0FBWSxTQUFaQSxLQUFZOztBQUNyQztBQUNBbkMseUJBQUtDLEtBQUwsQ0FBVyxTQUFYLEVBQXNCQyxNQUF0QixDQUE2QixVQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWWdDLEtBQVosRUFBbUJDLEtBQW5CLEVBQTZCO0FBQ3RELDRCQUFJQSxNQUFNUCxNQUFOLEtBQWlCTSxRQUFRLENBQTdCLEVBQWdDO0FBQzVCO0FBQ0FqQyxpQ0FBS0MsR0FBTCxJQUFZK0IsS0FBWjtBQUNIO0FBQ0QsK0JBQU9oQyxLQUFLQyxHQUFMLENBQVA7QUFDSCxxQkFORCxFQU1HakIsS0FOSDtBQU9IO0FBdEJZLGFBQWpCO0FBd0JIO0FBN0VzQjtBQThFMUI7OztFQS9Fa0NMLEs7O2VBQWxCQyxTIiwiZmlsZSI6InZ1ZXgtc3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG1vZGVsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4gcHJldltrZXldLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEucGx1cmFsaXplKG1vZGVsKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaEFsbFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkcyhxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZChxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hPbmU6ICh7IGNvbW1pdCB9LCB7IG1vZGVsLCBpZCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmQoeyB0eXBlOiBtb2RlbCwgaWQgfSkpLnRoZW4oZGF0YSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZShtb2RlbCkgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVwbGFjZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVtb3ZlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgZGF0YS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vVE9ETzogUmVsYXRlZFJlY29yZHMgdXBkYXRlIGFuZCBkZWxldGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm11dGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZXQ6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5sYXN0SW5kZXhPZigncycpICE9PSBtb2RlbC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVt0aGlzLnNjaGVtYS5wbHVyYWxpemUobW9kZWwpXS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGRhdGEuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5yZWxhdGlvbnNoaXBzID0gZGF0YS5yZWxhdGlvbnNoaXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmtleXMgPSBkYXRhLmtleXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkOiAoc3RhdGUsIHsgcGF0aCwgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL3NldCBpbiBmaWVsZFxuICAgICAgICAgICAgICAgICAgICBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5LCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59Il19