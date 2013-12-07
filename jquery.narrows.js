/*!
 * jQuery narrowing plugin
 * Version 0.0.2
 * @requires jQuery v1.7.0 or later
 *
 * Copyright 2013 Simon Yamada 山田史門
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Date: 2013-09-11
 */
(function ($) {
    var methods = {
        __relations: {},   // 親子関係を保持する配列
        __options: {},     // 子selectごとにoptionを全て保持
        __ukeys: {},       // selectに与えるユニークキーのリストを保持
        __ukey_name: 'jquery-narrows-unique-key', // select要素に付与するユニークキーの属性名
        __default_params: {
            disable_if_parent_is_null: true,
            null_value: '',
            allow_multiple_parent_values: false,
            multiple_parent_values_separator: ' *, *',
        },
        // 初期化
        init: function (selector, params) {
            var $parents = this;
            var $children = $(selector);
            // 引数チェック
            methods.validate_selects($parents, $children);
            // 設定のデフォルト値をオーバーライド
            var __params = {};
            for (var key in methods.__default_params) {
                __params[key] = params && params[key] !== void 0 ? params[key] : methods.__default_params[key];
            }
            if (__params.allow_multiple_parent_values) {
                __params.regexp_separator = new RegExp(__params.multiple_parent_values_separator);
            }
            params = __params;
            // この親子関係を登録
            methods.register_new_relations($parents, $children, params);
            // 子selectはとりあえず全てdisable（直後に適宜enable）
            if (params.disable_if_parent_is_null) {
                $children.attr('disabled', 'disabled');
            }
            // 親selectのイベントハンドラを設定
            $parents.on('change', methods.onchange_handler);
            // 絞り込みを初期化
            var relations = methods.get_relations_of($parents);
            for (var relation_i = 0, len = relations.length; relation_i < len; relation_i++) {
                var relation = relations[relation_i];
                if (relation.initialized) {
                    // 初期化は1回だけ
                    continue;
                }
                relation.initialized = true;
                methods.manage_this_relation(relation);
            }
            return $parents;
        },
        // 親子それぞれの select, option が正しく記述されているかをチェック
        validate_selects: function ($parents, $children) {
            // 親子select共通のチェック
            var arr = [$parents, $children];
            for (var arr_i = 0, len = arr.length; arr_i < len; arr_i++) {
                var $selects = arr[arr_i];
                if (0 === $selects.size()) {
                    $.error('selector '+$selects.selector+': element not found');
                }
                $selects.each(function () {
                    if ('SELECT' != $(this).prop('tagName')) {
                        $.error('selector '+$selects.selector+': includes non-select element(s)');
                    }
                    if (!$(this).attr('id')) {
                        $.error('id is required for all select elements');
                    }
                });
            }
            // 親子関係を data-x 属性で正しく記述しているかチェック
            var parent_ids = $parents.map(function () { return $(this).attr('id'); });
            $children.each(function () {
                for (var p_i = 0, len = parent_ids.length; p_i < len; p_i++) {
                    var attr = 'data-' + parent_ids[p_i];
                    var $select = $(this);
                    $select.find('option').each(function () {
                        // value="" の option 以外は data-<parent_id> 属性必須
                        var $option = $(this);
                        if ($option.val() && !$option.attr(attr)) {
                            var id = $select.attr('id');
                            $.error('options of select "#'+id+'" require "'+attr+'" attribute');
                        }
                    });
                }
            });
        },
        // 親子関係を新規登録
        register_new_relations: function ($parents, $children, params) {
            // 親子それぞれの select にランダムなユニークキーを割り当てる
            var parent_keys = [];
            $parents.each(function () {
                var parent_key = methods.unique_key($(this));
                parent_keys.push(parent_key);
            });
            var child_keys = [];
            $children.each(function () {
                var child_key = methods.unique_key($(this));
                child_keys.push(child_key);
                // 子selectのoptionを配列で全部持つ
                methods.__options[child_key] = $(this).find('option').get();
            });
            // 親selectのユニークキーをキーとして、親子関係を __relations に保持する
            for (var p_i = 0, len = parent_keys.length; p_i < len; p_i++) {
                var parent_key = parent_keys[p_i];
                if (!methods.__relations[parent_key])
                    methods.__relations[parent_key] = [];
                methods.__relations[parent_key].push({
                    $parents:$parents,
                    $children:$children,
                    params:params,
                    initialized:false
                });
            }
        },
        // ユニークなキーを生成して $element に属性として与える
        unique_key: function ($element) {
            // 割り当て済みのunique keyがあればそれを返す
            var ukey = $element.data(methods.__ukey_name);
            if (ukey) {
                return ukey;
            }
            // ユニークなキーを生成
            do {
                ukey = (Math.random() * 10000000 | 0).toString(16);
            } while (methods.__ukeys[ukey] !== void 0);
            $element.data(methods.__ukey_name, ukey);
            // キャッシュ
            methods.__ukeys[ukey] = 1;
            return ukey;
        },
        // 親selectのchangeイベントハンドラ
        onchange_handler: function (e) {
            var relations = methods.get_relations_of($(this));
            for (var relation_i = 0, len = relations.length; relation_i < len; relation_i++) {
                var relation = relations[relation_i];
                methods.manage_this_relation(relation);
            }
        },
        // 親selectで選択された値に基づいて子selectを絞り込む
        manage_this_relation: function (relation) {
            // 全ての親selectで選択したvalueを調べる
            var parent_selected_values = {};
            var all_parents_selected = true;
            relation.$parents.each(function () {
                var value = $(this).val();
                if (value == relation.params.null_value) {
                    all_parents_selected = false;
                    return false;
                }
                parent_selected_values[$(this).attr('id')] = value;
            });
            if (all_parents_selected) {
                // この親子関係の全ての親selectで value="" 以外の値が選択された。
                // 対応するoptionを子selectに追加
                relation.$children.each(function () {
                    methods.enable_relevant_options($(this), relation, parent_selected_values);
                });
            } else {
                // この親子関係の親selectのどれかで value="" が選択された。
                if (relation.params.disable_if_parent_is_null) {
                    // 子selectのoptionを全て削除してdisable
                    relation.$children.each(function () {
                        methods.disable_all_options($(this), relation);
                    });
                } else {
                    // 子selectのoptionを全部表示
                    relation.$children.each(function () {
                        methods.enable_all_options($(this), relation);
                    });
                }
            }
            // 子孫selectへイベントを伝播
            relation.$children.trigger('change');
        },
        // 親selectで選択された値に対応するoptionを有効にする
        enable_relevant_options: function ($select, relation, parent_selected_values) {
            var previously_selected_value = $select.val();
            $select
                // disabled解除
                .removeAttr('disabled')
                // option要素をDOMから一旦べしっと削除
                .find('option[value!=""]').remove();
            // 全てのoptionのうち、親selectの選択結果に適合するもののみ追加
            var all_options = methods.get_all_options_of($select);
            for (var option_i = 0, len = all_options.length; option_i < len; option_i++) {
                var $option = $(all_options[option_i]);
                if (!$option.val()) {
                    continue;
                }
                // このoptionが全ての親selectの選択結果にマッチするか確認
                var relevant_option = true;
                for (var parent_id in parent_selected_values) {
                    var parent_selected_value = parent_selected_values[parent_id];
                    var relevant_value = $option.data(parent_id);
                    if (relation.params.allow_multiple_parent_values) {
                        // セパレータ区切りで複数の親にマッチ
                        var relevant_values = relevant_value.toString().split(relation.params.regexp_separator);
                        var matched_any = false;
                        for (var r_i = 0, r_len = relevant_values.length; r_i < r_len; r_i++) {
                            if (relevant_values[r_i] == parent_selected_value) {
                                matched_any = true; break;
                            }
                        }
                        if (!matched_any) {
                            relevant_option = false; break;
                        }
                    } else {
                        // 単一の親にマッチ
                        if (relevant_value != parent_selected_value) {
                            relevant_option = false; break;
                        }
                    }
                }
                if (relevant_option) {
                    // このoptionを子selectに追加
                    // さっきまで選択されてたoptionであればselectedに
                    if ($option.val() == previously_selected_value) {
                        $option.prop('selected', true);
                    }
                    $select.append($option);
                }
            }
        },
        // 全てのoptionを有効にする
        enable_all_options: function ($select, relation) {
            var previously_selected_child_value = $select.val();
            $select
                // disabled解除
                .removeAttr('disabled')
                // option要素をDOMから一旦べしっと削除
                .find('option[value!=""]').remove();
            // 全てのoptionを追加
            var all_options = methods.get_all_options_of($select);
            for (var option_i = 0, len = all_options.length; option_i < len; option_i++) {
                var $option = $(all_options[option_i]);
                // さっきまで選択されてたoptionであればselectedに
                if ($option.val() == previously_selected_child_value) {
                    $option.prop('selected', true);
                }
                $select.append($option);
            }
        },
        // 全てのoptionを無効にする
        disable_all_options: function ($select, relation) {
            $select
                .attr('disabled', 'disabled').val(relation.params.null_value)
                .find('option[value!=""]').remove();
        },
        // $select を親とする全ての親子関係を取得する
        get_relations_of: function ($select) {
            var ukey = $select.data(methods.__ukey_name);
            return methods.__relations[ukey];
        },
        // $select の全ての option 要素を返す
        get_all_options_of: function ($select) {
            var ukey = $select.data(methods.__ukey_name);
            return methods.__options[ukey];
        }
    };
    $.fn.narrows = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || typeof method === 'string' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.narrows');
        }
    };
})(jQuery);
