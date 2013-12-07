$(function () {
    // 例1：親→子
    describe('例1', function() {
        // jquery instances of the select elements
        var $category = $('#ex1-food-category');
        var $food = $('#ex1-food');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $category.val('').trigger('change');
            $food.val('').trigger('change');
        });

        it('food は初期状態で disabled', function () {
            expect($category.is(':disabled')).toBe(false);
            expect($food.is(':disabled')).toBe(true);
        });

        it('category で "meat" を選択したら food は肉に絞り込まれる', function () {
            // category を選択
            $category.val('meat').trigger('change');
            // food の disabled 解除
            expect($category.is(':disabled')).toBe(false);
            expect($food.is(':disabled')).toBe(false);
            // value="" を含め絞りこまれたoptionは2つ以上
            expect($food.find('option').size()).toBeGreaterThan(1);
            // option の data-xx 属性が全て "meat"
            $food.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex1-food-category')).toEqual('meat');
                }
            });
        });

        it('category で value="" を選択したら food は disabled', function () {
            // category, food を選択してから
            $category.val('meat').trigger('change');
            $food.val('beef').trigger('change');
            // category を非選択状態にする
            $category.val('').trigger('change');
            // food は disabled
            expect($category.is(':disabled')).toBe(false);
            expect($food.is(':disabled')).toBe(true);
            // food は value=""
            expect($food.val()).toBe('');
        });
    });

    // 例2：親→子、親selectが未選択の場合、子selectは全て選択可能
    describe('例2', function() {
        // jquery instances of the select elements
        var $category = $('#ex2-food-category');
        var $food = $('#ex2-food');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $category.val('').trigger('change');
            $food.val('').trigger('change');
        });

        it('category, food とも初期状態で enabled', function () {
            expect($category.is(':disabled')).toBe(false);
            expect($food.is(':disabled')).toBe(false);
        });

        it('category で "meat" を選択したら food は肉に絞り込まれる', function () {
            // category を選択
            $category.val('meat').trigger('change');
            // foodのdisabled解除
            expect($category.is(':disabled')).toBe(false);
            expect($food.is(':disabled')).toBe(false);
            // value="" を含め絞りこまれたoptionは2つ以上
            expect($food.find('option').size()).toBeGreaterThan(1);
            // option の data-xx 属性が全て "meat"
            $food.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex2-food-category')).toEqual('meat');
                }
            });
        });

        it('category で value="" を選択したら、food は全ての option が選択可能になる', function () {
            // category, food を選択してから
            $category.val('meat').trigger('change');
            $food.val('beef').trigger('change');
            // category を非選択状態にする
            $category.val('').trigger('change');
            // food は enabled
            expect($category.is(':disabled')).toBe(false);
            expect($food.is(':disabled')).toBe(false);
            // food の選択肢は様々
            var categories = $food.find('option[value!=""]').map(function () {
                return $(this).data('ex2-food-category');
            }).get();
            expect(categories.indexOf('meat')).not.toBe(-1);
            expect(categories.indexOf('vegetable')).not.toBe(-1);
            expect(categories.indexOf('fruit')).not.toBe(-1);
        });
    });

    // 例3：親→子→孫
    describe('例3', function() {
        // jquery instances of the select elements
        var $continent = $('#ex3-continent');
        var $country = $('#ex3-country');
        var $city = $('#ex3-city');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $continent.val('').trigger('change');
            $country.val('').trigger('change');
            $city.val('').trigger('change');
        });

        it('country, city は初期状態で disabled', function () {
            expect($continent.is(':disabled')).toBe(false);
            expect($country.is(':disabled')).toBe(true);
            expect($city.is(':disabled')).toBe(true);
        });

        it('continent で "asia" を選択したら country はアジアの国に絞り込まれる', function () {
            // continent を選択
            $continent.val('asia').trigger('change');
            // countryのdisabled解除、cityはdisabledのまま
            expect($continent.is(':disabled')).toBe(false);
            expect($country.is(':disabled')).toBe(false);
            expect($city.is(':disabled')).toBe(true);
            // value="" を含め絞りこまれたoptionは2つ以上
            expect($country.find('option').size()).toBeGreaterThan(1);
            // option の data-xx 属性が全て "asia"
            $country.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex3-continent')).toEqual('asia');
                }
            });
        });

        it('continent で "asia", country で "japan" を選択したら city は日本の都市に絞り込まれる', function () {
            // continent, country を選択
            $continent.val('asia').trigger('change');
            $country.val('japan').trigger('change');
            // disabled全て解除
            expect($continent.is(':disabled')).toBe(false);
            expect($country.is(':disabled')).toBe(false);
            expect($city.is(':disabled')).toBe(false);
            // value="" を含め絞りこまれたoptionは2つ以上
            expect($city.find('option').size()).toBeGreaterThan(1);
            // option の data-xx 属性が全て "asia"
            $city.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex3-country')).toEqual('japan');
                }
            });
        });

        it('continent で value="" を選択したら country, city は disabled', function () {
            // continent, country, city を選択してから
            $continent.val('asia').trigger('change');
            $country.val('japan').trigger('change');
            $city.val('tokyo').trigger('change');
            // continent を非選択状態にする
            $continent.val('').trigger('change');
            // country, city は disabled
            expect($continent.is(':disabled')).toBe(false);
            expect($country.is(':disabled')).toBe(true);
            expect($city.is(':disabled')).toBe(true);
            // country, city は value=""
            expect($country.val()).toBe('');
            expect($city.val()).toBe('');
        });
    });

    // 例4：親→子1、子2
    describe('例4', function() {
        // jquery instances of the select elements
        var $cuisine = $('#ex4-cuisine');
        var $food = $('#ex4-food');
        var $alcohol = $('#ex4-alcohol');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $cuisine.val('').trigger('change');
            $food.val('').trigger('change');
            $alcohol.val('').trigger('change');
        });

        it('food, alcohol は初期状態で disabled', function () {
            expect($cuisine.is(':disabled')).toBe(false);
            expect($food.is(':disabled')).toBe(true);
            expect($alcohol.is(':disabled')).toBe(true);
        });

        it('cuisine で "japanese" を選択したら food, alcohol 両方とも絞り込まれる', function () {
            // cuisine で japanese を選択
            $cuisine.val('japanese').trigger('change');
            // food の disabled が解け、japanese で絞り込まれる
            expect($food.is(':disabled')).toBe(false);
            expect($food.find('option').size()).toBeGreaterThan(1);
            $food.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex4-cuisine')).toEqual('japanese');
                }
            });
            // alcohol の disabled が解け、japanese で絞り込まれる
            expect($alcohol.is(':disabled')).toBe(false);
            expect($alcohol.find('option').size()).toBeGreaterThan(1);
            $alcohol.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex4-cuisine')).toEqual('japanese');
                }
            });
        });

        it('cuisine で value="" を選択したら food, alcohol は disabled', function () {
            // select cuisine
            $cuisine.val('japanese').trigger('change');
            // ... and reset
            $cuisine.val('').trigger('change');
            expect($food.is(':disabled')).toBe(true);
            expect($alcohol.is(':disabled')).toBe(true);
        });
    });

    // 例5：親1、親2→子
    describe('例5', function() {
        // jquery instances of the select elements
        var $country = $('#ex5-country');
        var $category = $('#ex5-category');
        var $menu = $('#ex5-menu');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $country.val('').trigger('change');
            $category.val('').trigger('change');
            $menu.val('').trigger('change');
        });

        it('menu は初期状態で disabled', function () {
            expect($country.is(':disabled')).toBe(false);
            expect($category.is(':disabled')).toBe(false);
            expect($menu.is(':disabled')).toBe(true);
        });

        it('country だけ選択しても menu は disabled のまま', function () {
            // select country
            $country.val('japanese').trigger('change');
            expect($menu.is(':disabled')).toBe(true);
        });

        it('category だけ選択しても menu は disabled のまま', function () {
            // select category
            $category.val('food').trigger('change');
            expect($menu.is(':disabled')).toBe(true);
        });

        it('country で "japanese", category で "food" を選択したら menu が絞り込まれる', function () {
            // select country & category
            $country.val('japanese').trigger('change');
            $category.val('food').trigger('change');
            expect($menu.find('option').size()).toBeGreaterThan(1);
            $menu.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex5-country')).toEqual('japanese');
                    expect($(this).data('ex5-category')).toEqual('food');
                }
            });
        });

        it('country で value="" を選択したら menu は disabled', function () {
            // 一度両方選択してから
            $country.val('japanese').trigger('change');
            $category.val('food').trigger('change');
            // country を非選択状態にする
            $country.val('').trigger('change');
            expect($menu.is(':disabled')).toBe(true);
            expect($menu.val()).toBe('');
        });

        it('category で value="" を選択したら menu は disabled', function () {
            // 一度両方選択してから
            $country.val('japanese').trigger('change');
            $category.val('food').trigger('change');
            // category を非選択状態にする
            $category.val('').trigger('change');
            expect($menu.is(':disabled')).toBe(true);
            expect($menu.val()).toBe('');
        });
    });

    // 例6：親→子
    describe('例6', function() {
        // jquery instances of the select elements
        var $category = $('#ex6-category');
        var $menu = $('#ex6-menu');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $category.val('').trigger('change');
            $menu.val('').trigger('change');
        });

        it('menu は初期状態で disabled', function () {
            expect($category.is(':disabled')).toBe(false);
            expect($menu.is(':disabled')).toBe(true);
        });

        it('category で "food" を選択したら menu にうどん、カレーが含まれる', function () {
            // category で food を選択
            $category.val('food').trigger('change');
            // menu にうどんが含まれることを確認
            expect($menu.find('option[value=udon]').size()).toBe(1);
        });

        it('category で "drink" を選択しても menu にうどん、カレーが含まれる', function () {
            // category で drink を選択
            $category.val('drink').trigger('change');
            // menu にうどんが含まれることを確認
            expect($menu.find('option[value=udon]').size()).toBe(1);
        });
    });

    // (dummy spec) reset all selections after the tests
    describe('(dummy spec)', function() {
        it('reset all selects', function () {
            $('#ex1-food-category').val('').trigger('change');
            $('#ex1-food').val('').trigger('change');
            $('#ex2-food-category').val('').trigger('change');
            $('#ex2-food').val('').trigger('change');
            $('#ex3-continent').val('').trigger('change');
            $('#ex3-country').val('').trigger('change');
            $('#ex3-city').val('').trigger('change');
            $('#ex4-cuisine').val('').trigger('change');
            $('#ex4-food').val('').trigger('change');
            $('#ex4-alcohol').val('').trigger('change');
            $('#ex5-country').val('').trigger('change');
            $('#ex5-category').val('').trigger('change');
            $('#ex5-menu').val('').trigger('change');
            $('#ex6-category').val('').trigger('change');
            $('#ex6-menu').val('').trigger('change');
        });
    });
});
