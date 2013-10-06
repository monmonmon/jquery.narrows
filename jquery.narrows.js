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
        __ukey_name: 'jquery-narrows-unique-key', // selectに与えるユニークキーの属性名
        // 初期化
        init: function (selector) {
            var $parents = this;
            var $children = $(selector);
            // 引数チェック
            methods.check_parameters($parents, $children);
            // この親子関係を登録
            methods.add_new_relations($parents, $children);
            // 子selectはとりあえず全てdisable（後で条件次第でenable）
            $children.attr('disabled', 'disabled');
            // 親selectのイベントハンドラを設定
            $parents.on('change init', methods.onchange_handler)
                .trigger('init'); // 初期化イベントをトリガー
            return $parents;
        },
        // パラメータチェック
        check_parameters: function ($parents, $children) {
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
        add_new_relations: function ($parents, $children) {
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
            var ukey = $(this).data(methods.__ukey_name);
            var relations = methods.__relations[ukey];
            for (var relation_i = 0, len = relations.length; relation_i < len; relation_i++) {
                var relation = relations[relation_i];
                if ('init' == e.type && relation.initialized) {
                    // 何度も初期化しない
                    continue;
                }
                relation.initialized = true;
                // 親selectの選択されたvalueを取得
                var parent_selected_values = {};
                var all_parents_selected = true;
                relation.$parents.each(function () {
                    var value = $(this).val();
                    if (!value) {
                        all_parents_selected = false;
                        return false;
                    }
                    parent_selected_values[$(this).attr('id')] = value;
                });
                if (!all_parents_selected) {
                    // この親子関係の親selectのどれかで value="" が選択された
                    // 子selectをdisableして、value="" とする
                    relation.$children.each(function () {
                        $(this)
                            .attr('disabled', 'disabled').val('')
                            .find('option[value!=""]').remove();
                    });
                } else {
                    // この親子関係の全ての親selectで値が選択された
                    relation.$children.each(function () {
                        $child_select = $(this);
                        var previously_selected_child_value = $child_select.val();
                        $child_select
                        // 子selectのdisabled解除
                            .removeAttr('disabled')
                        // 子selectのoption要素をDOMから一旦べしっと削除
                            .find('option[value!=""]').remove();
                        // 子selectの全てのoptionのうち、親selectの選択結果に適合するもののみ
                        // 子selectに追加していく
                        var ukey = $child_select.data(methods.__ukey_name);
                        var all_options = methods.__options[ukey];
                        for (var option_i = 0, len = all_options.length; option_i < len; option_i++) {
                            var $option = $(all_options[option_i]);
                            var option_is_suitable = true;
                            for (var parent_id in parent_selected_values) {
                                var parent_value = parent_selected_values[parent_id];
                                if ($option.data(parent_id) != parent_value) {
                                    option_is_suitable = false;
                                    break;
                                }
                            }
                            if (option_is_suitable) {
                                // 全ての親selectの選択結果に適合した。子selectにoptionを追加する
                                // さっきまで選択されてたoptionであればselectedにしてやる
                                if ($option.val() == previously_selected_child_value) {
                                    $option.prop('selected', true);
                                }
                                $child_select.append($option);
                            }
                        }
                    });
                }
                // 子孫selectへイベントを伝播
                relation.$children.trigger(e.type);
            }
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
