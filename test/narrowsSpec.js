$(function () {
    //------------------------------
    // describe specifications

    // 例2：親→子→孫
    describe('ex2', function() {
        var $continent, $country, $city;

        // jquery instances of the select elements
        $continent = $('#ex2-continent');
        $country = $('#ex2-country');
        $city = $('#ex2-city');

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
                    expect($(this).data('ex2-continent')).toEqual('asia');
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
                    expect($(this).data('ex2-country')).toEqual('japan');
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

    // 例3：親→子1、子2
    describe('ex3', function() {
        var $cuisine, $food, $alcohol;

        // jquery instances of the select elements
        $cuisine = $('#ex3-cuisine');
        $food = $('#ex3-food');
        $alcohol = $('#ex3-alcohol');

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
                    expect($(this).data('ex3-cuisine')).toEqual('japanese');
                }
            });
            // alcohol の disabled が解け、japanese で絞り込まれる
            expect($alcohol.is(':disabled')).toBe(false);
            expect($alcohol.find('option').size()).toBeGreaterThan(1);
            $alcohol.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex3-cuisine')).toEqual('japanese');
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

    // 例4：親1、親2→子
    describe('ex4', function() {
        var $country, $category, $menu;

        // jquery instances of the select elements
        $country = $('#ex4-country');
        $category = $('#ex4-category');
        $menu = $('#ex4-menu');

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
                    expect($(this).data('ex4-country')).toEqual('japanese');
                    expect($(this).data('ex4-category')).toEqual('food');
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

    // (dummy spec) reset all selections after the tests
    describe('(dummy spec)', function() {
        it('reset all selects', function () {
            $('#ex2-continent').val('').trigger('change');
            $('#ex2-country').val('').trigger('change');
            $('#ex2-city').val('').trigger('change');
            $('#ex3-cuisine').val('').trigger('change');
            $('#ex3-food').val('').trigger('change');
            $('#ex3-alcohol').val('').trigger('change');
            $('#ex4-country').val('').trigger('change');
            $('#ex4-category').val('').trigger('change');
            $('#ex4-menu').val('').trigger('change');
        });
    });
});
