"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require("@orbit/store");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
}

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
                fetchOne: function (_ref2, _ref3) {
                    var commit = _ref2.commit;
                    var model = _ref3.model,
                        id = _ref3.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: _this._schema.singularize(model) });
                    });
                },
                update: function (_ref4, data) {
                    var commit = _ref4.commit;

                    _this.update(function (t) {
                        return t.replaceRecord(data);
                    }).then(function () {
                        return commit('set', { data: data, model: data.type });
                    });
                }
            };
            _this.mutations = {
                set: function (state, _ref5) {
                    var data = _ref5.data,
                        model = _ref5.model;

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
                updateField: function (state, _ref6) {
                    var path = _ref6.path,
                        value = _ref6.value;

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
}(_store2.default);

exports.default = VuexStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiZmV0Y2hBbGxPZiIsImNvbW1pdCIsInEiLCJkYXRhIiwiZmV0Y2hPbmUiLCJpZCIsInR5cGUiLCJ1cGRhdGUiLCJ0Iiwic2V0Iiwic3RhdGUiLCJpdGVtIiwidXBkYXRlRmllbGQiLCJwYXRoIiwidmFsdWUiLCJhcnJheSIsImluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFDcUJBLFk7OztBQUNqQixhQUFBLFNBQUEsR0FBMkI7QUFBQSxZQUFmRSxXQUFlLFVBQUEsTUFBQSxHQUFBLENBQUEsSUFBQSxVQUFBLENBQUEsTUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBLENBQUEsR0FBSixFQUFJOztBQUFBLHdCQUFBLElBQUEsRUFBQSxTQUFBOztBQUFBLFlBQUEsUUFBQSwyQkFBQSxJQUFBLEVBQ3ZCLE9BQUEsSUFBQSxDQUFBLElBQUEsRUFEdUIsUUFDdkIsQ0FEdUIsQ0FBQTs7QUFFdkIsY0FBQSxVQUFBLEdBQUEsS0FBQTtBQUNBLFlBQUlBLFNBQUosTUFBQSxFQUFxQjtBQUNqQjtBQUNBLGtCQUFBLEtBQUEsR0FBYSxNQUFBLEtBQUEsSUFBYixFQUFBO0FBQ0FDLG1CQUFBQSxJQUFBQSxDQUFZLE1BQUEsT0FBQSxDQUFaQSxNQUFBQSxFQUFBQSxPQUFBQSxDQUF5QyxVQUFBLElBQUEsRUFBUTtBQUM3QyxvQkFBSUMsUUFBUUYsU0FBQUEsTUFBQUEsQ0FBQUEsUUFBQUEsQ0FBWixJQUFZQSxDQUFaO0FBQ0Esc0JBQUEsS0FBQSxHQUFhLE1BQUEsS0FBQSxJQUFiLEVBQUE7QUFDQTtBQUNBLHNCQUFBLEtBQUEsQ0FBVyxNQUFBLE9BQUEsQ0FBQSxXQUFBLENBQVgsSUFBVyxDQUFYLElBQUEsS0FBQTtBQUNBLHNCQUFBLEtBQUEs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SUFBQUE7QUFDSDtBQUxMRCx5QkFBQUE7QUFPSDtBQVhRLGlCQUFBO0FBYWJFLDZCQUFhLFVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBNEI7QUFBQSx3QkFBbEJDLE9BQWtCLE1BQWxCQSxJQUFrQjtBQUFBLHdCQUFaQyxRQUFZLE1BQVpBLEtBQVk7O0FBQ3JDO0FBQ0FELHlCQUFBQSxLQUFBQSxDQUFBQSxTQUFBQSxFQUFBQSxNQUFBQSxDQUE2QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBNkI7QUFDdEQsNEJBQUlFLE1BQUFBLE1BQUFBLEtBQWlCQyxRQUFyQixDQUFBLEVBQWdDO0FBQzVCO0FBQ0FqQixpQ0FBQUEsR0FBQUEsSUFBQUEsS0FBQUE7QUFDSDtBQUNELCtCQUFPQSxLQUFQLEdBQU9BLENBQVA7QUFMSmMscUJBQUFBLEVBQUFBLEtBQUFBO0FBT0g7QUF0QlksYUFBakI7QUF3Qkg7QUE1RHNCLGVBQUEsS0FBQTtBQTZEMUI7OztFQTlEa0NuQixlOztrQkFBbEJELFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG1vZGVsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4gcHJldltrZXldLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEucGx1cmFsaXplKG1vZGVsKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKG1vZGVsKSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGU6ICh7IGNvbW1pdCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZXBsYWNlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==