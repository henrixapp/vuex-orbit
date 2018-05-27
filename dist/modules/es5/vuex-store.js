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
}(Store);

export default VuexStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImZldGNoQWxsT2YiLCJjb21taXQiLCJxdWVyeSIsInEiLCJmaW5kUmVjb3JkcyIsInRoZW4iLCJkYXRhIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJ1cGRhdGUiLCJ0IiwicmVwbGFjZVJlY29yZCIsIm11dGF0aW9ucyIsInNldCIsImxhc3RJbmRleE9mIiwibGVuZ3RoIiwiaXRlbSIsImF0dHJpYnV0ZXMiLCJyZWxhdGlvbnNoaXBzIiwidXBkYXRlRmllbGQiLCJ2YWx1ZSIsImluZGV4IiwiYXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxNQUFrQixjQUFsQjs7SUFDcUJDLFM7OztBQUNqQix5QkFBMkI7QUFBQSxZQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEscURBQ3ZCLGtCQUFNQSxRQUFOLENBRHVCOztBQUV2QixjQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0EsWUFBSUQsU0FBU0UsTUFBYixFQUFxQjtBQUNqQjtBQUNBLGtCQUFLQyxLQUFMLEdBQWEsTUFBS0EsS0FBTCxJQUFjLEVBQTNCO0FBQ0FDLG1CQUFPQyxJQUFQLENBQVksTUFBS0MsT0FBTCxDQUFhQyxNQUF6QixFQUFpQ0MsT0FBakMsQ0FBeUMsZ0JBQVE7QUFDN0Msb0JBQUlDLFFBQVFULFNBQVNFLE1BQVQsQ0FBZ0JRLFFBQWhCLENBQXlCQyxJQUF6QixDQUFaO0FBQ0Esc0JBQUtS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SUFBakI7QUFDSDtBQUNKLHlCQU5EO0FBT0g7QUFDSixpQkFaWTtBQWFicUMsNkJBQWEsVUFBQ3ZDLEtBQUQsU0FBNEI7QUFBQSx3QkFBbEJhLElBQWtCLFNBQWxCQSxJQUFrQjtBQUFBLHdCQUFaMkIsS0FBWSxTQUFaQSxLQUFZOztBQUNyQztBQUNBM0IseUJBQUtDLEtBQUwsQ0FBVyxTQUFYLEVBQXNCQyxNQUF0QixDQUE2QixVQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWXdCLEtBQVosRUFBbUJDLEtBQW5CLEVBQTZCO0FBQ3RELDRCQUFJQSxNQUFNUCxNQUFOLEtBQWlCTSxRQUFRLENBQTdCLEVBQWdDO0FBQzVCO0FBQ0F6QixpQ0FBS0MsR0FBTCxJQUFZdUIsS0FBWjtBQUNIO0FBQ0QsK0JBQU94QixLQUFLQyxHQUFMLENBQVA7QUFDSCxxQkFORCxFQU1HakIsS0FOSDtBQU9IO0FBdEJZLGFBQWpCO0FBd0JIO0FBNURzQjtBQTZEMUI7OztFQTlEa0NMLEs7O2VBQWxCQyxTIiwiZmlsZSI6InZ1ZXgtc3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG1vZGVsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4gcHJldltrZXldLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEucGx1cmFsaXplKG1vZGVsKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKG1vZGVsKSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGU6ICh7IGNvbW1pdCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZXBsYWNlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==