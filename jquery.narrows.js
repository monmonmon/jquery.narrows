// 親selectの選択結果に応じて、子selectの選択肢を絞り込む。
// 例：ホテルselectでホテルを選択したら、部屋selectの選択肢がそのホテルの部屋のみになる、とか。
// 子 select の option 要素の data-parent-value 属性に $parent の value 値を持たせ、親子関係を定義。
// 「非選択状態」を表すoptionのvalueは空にして下さいな→ <option value="">Select One</option>
//
// 親selectは複数の子selectを持てまする
(function ($) {
    var methods = {
        relations: [],
        //parent_value_key: 'value',
        init: function (selector, parent_value_key) {
            $child = $(selector);
            // 引数チェック
            methods.check_parameters(this, $child);
            // この親子関係を登録
            methods.add_new_relations(this, $child, parent_value_key);
            // 子selectはとりあえずdisable（条件次第でenable）
            $child.attr('disabled', 'disabled');
            // 親selectのchangeイベントハンドラを設定
            this.on('change', methods.change_event_handler)
                .trigger('change'); // 初期化のためイベント１発目を発生
            return this;
        },
        check_parameters: function ($parent, $child) {
            if (1 != $parent.size())
                $.error('the size of the "parent" select have to be 1 (found to be '+$parent.size()+')');
            if ('SELECT' != $parent[0].tagName)
                $.error('the base element is not a select element');
            if (!$child)
                $.error('require a jQuery object which represents a select element');
            if (1 != $child.size())
                $.error('the size of the "child" select have to be 1 (found to be '+$child.size()+')');
            if ('SELECT' != $child[0].tagName)
                $.error('the child element is not a select element');
        },
        add_new_relations: function ($parent, $child, parent_value_key) {
            // 親子それぞれの select にランダムなユニークキーを生成して与える
            var key1 = $parent.data('narrowing-key');
            if (!key1) {
                var key1 = methods.unique_key();
                $parent.data('narrowing-key', key1)
            }
            var key2 = $child.data('narrowing-key');
            if (!key2) {
                var key2 = methods.unique_key();
                $child.data('narrowing-key', key2)
            }
            // 参照する親の属性（デフォルト value）
            parent_value_key = parent_value_key ? parent_value_key : 'value';
            // ユニークキーでこの親子関係を管理
            if (!methods.relations[key1])
                methods.relations[key1] = [];
            methods.relations[key1][key2] = {
                $parent:this,
                $child:$child,
                parent_value_key:parent_value_key,
                options:$child.find('option').get(), // 子selectのoptionを配列で全部持つ
            };
        },
        __unique_keys:[],
        unique_key:function () {
            var key = null;
            do {
                key = (Math.random() * 10000000 | 0).toString(16);
            } while (methods.__unique_keys[key] !== void 0);
            methods.__unique_keys[key] = 1;
            return key;
        },
        change_event_handler: function () {
            // $parent で選択肢が変更された。
            var key1 = $(this).data('narrowing-key');
            var relations = methods.relations[key1];
            var index1 = $(this).prop('selectedIndex');
            for (var key2 in relations) {
                var relation = relations[key2];
                var parent_value = $(this).find('option:nth('+index1+')')
                    .attr(relation.parent_value_key);
                if (!parent_value) {
                    // 親selectで value="" を選択した。子selectをdisableして、value="" を選択させる
                    relation.$child
                        .attr('disabled', 'disabled')
                        .find('option[value=""]').prop('selected', true)
                    relation.$child
                        .find('option[value!=""]').remove();
                } else {
                    // 親selectで値を選択したので子selectへ反映するよ。
                    // 子selectで現在選択されてんのをとっとく
                    var index2 = relation.$child.prop('selectedIndex');
                    var selected_child_option = relation.$child.find('option:nth('+index2+')');
                    var previously_selected_child_value = null;
                    if (parent_value == selected_child_option.data('parent-value')) {
                        previously_selected_child_value = selected_child_option.val();
                    }
                    // 子selectのdisabled解除
                    relation.$child.removeAttr('disabled')
                    // 子selectの選択肢を一旦べしっと削除するぜ。
                    relation.$child.find('option[value!=""]').remove();
                    // んで親selectで選択した値の子供データのみ、option生成して子selectに追加
                    var options = relation.options;
                    var arr = [];
                    for (var i in options) {
                        var $option = $(options[i]);
                        arr.push($option.data('parent-value') + ': ' + $option.val());
                        if ($option.data('parent-value') == parent_value) {
                            if ($option.val() == previously_selected_child_value) {
                                $option.prop('selected', true);
                            }
                            relation.$child.append($option);
                        }
                    }
                }
                // 子孫selectへも反映
                relation.$child.trigger('change');
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
