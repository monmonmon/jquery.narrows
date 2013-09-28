$(function () {
    //------------------------------
    // describe specifications

    // 例2：親→子→孫
    describe('ex2', function() {
        var $continent, $country, $city;

        // jquery instances
        $continent = $('#ex2-continent');
        $country = $('#ex2-country');
        $city = $('#ex2-city');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $continent.val('').trigger('change');
        });

        it('child & grand child selects should be disabled initially', function () {
            expect($country.attr('disabled')).toBeTruthy();
            expect($city.attr('disabled')).toBeTruthy();
        });

        it('child select should have been narrowed by a value "asia"', function () {
            // select continent
            $continent.val('asia').trigger('change');

            $country.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex2-continent')).toEqual('asia');
                }
            });
            expect($city.attr('disabled')).toBeTruthy();
        });

        it('grand child select should have been narrowed by continent "asia" and country "japan"', function () {
            // select continent & country
            $continent.val('asia').trigger('change');
            $country.val('japan').trigger('change');

            $country.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex2-continent')).toEqual('asia');
                }
            });
            $city.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex2-country')).toEqual('japan');
                }
            });
        });

        it('both child & grand child selects should be disabled after selecting null value in the parent select', function () {
            // select continent & country
            $continent.val('asia').trigger('change');
            $country.val('japan').trigger('change');
            // ... and reset continent
            $continent.val('').trigger('change');

            expect($country.attr('disabled')).toBeTruthy();
            expect($city.attr('disabled')).toBeTruthy();
        });
    });

    // 例3：親→子1、子2
    describe('ex3', function() {
        var $cuisine, $food, $alcohol;

        // jquery instances
        $cuisine = $('#ex3-cuisine');
        $food = $('#ex3-food');
        $alcohol = $('#ex3-alcohol');

        // narrow the select elements
        $cuisine.narrows('#ex3-food, #ex3-alcohol');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $cuisine.val('').trigger('change');
        });

        it('both child selects should be disabled initially', function () {
            expect($food.attr('disabled')).toBeTruthy();
            expect($alcohol.attr('disabled')).toBeTruthy();
        });

        it('both child selects should have been narrowed by a value "japanese"', function () {
            // select cuisine
            $cuisine.val('japanese').trigger('change');

            $food.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex3-cuisine')).toEqual('japanese');
                }
            });
            $food.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex3-cuisine')).toEqual('japanese');
                }
            });
        });

        it('both child selects should be disabled after selecting null value in the parent select', function () {
            // select cuisine
            $cuisine.val('japanese').trigger('change');
            // ... and reset
            $cuisine.val('').trigger('change');

            expect($food.attr('disabled')).toBeTruthy();
            expect($alcohol.attr('disabled')).toBeTruthy();
        });
    });

    // 例4：親1、親2→子
    describe('ex4', function() {
        var $country, $category, $menu;

        // jquery instances
        $country = $('#ex4-country');
        $category = $('#ex4-category');
        $menu = $('#ex4-menu');

        // 各テストの最初に選択状態を初期化
        beforeEach(function() {
            $country.val('').trigger('change');
            $category.val('').trigger('change');
        });

        it('child select should be disabled initially', function () {
            expect($menu.attr('disabled')).toBeTruthy();
        });

        it('child select shouldn\'t be enabled when only country is selected', function () {
            // select country
            $country.val('japanese').trigger('change');

            expect($menu.attr('disabled')).toBeTruthy();
        });

        it('child select shouldn\'t be enabled when only category is selected', function () {
            // select category
            $category.val('food').trigger('change');

            expect($menu.attr('disabled')).toBeTruthy();
        });

        it('child select should have been narrowed by both "japanese" and "food"', function () {
            // select country & category
            $country.val('japanese').trigger('change');
            $category.val('food').trigger('change');

            $menu.find('option').each(function () {
                if ($(this).val()) {
                    expect($(this).data('ex4-country')).toEqual('japanese');
                    expect($(this).data('ex4-category')).toEqual('food');
                }
            });
        });

        it('both child selects should be disabled after selecting null value in the parent select', function () {
            // select country & category
            $country.val('japanese').trigger('change');
            $category.val('food').trigger('change');
            // ... and reset
            $country.val('').trigger('change');

            expect($menu.attr('disabled')).toBeTruthy();
        });
    });

    // (dummy description) reset all selections after the tests
    describe('reset', function() {
        it('(dummy spec) reset all selections', function () {
            $('#ex2-continent').val('').trigger('change');
            $('#ex3-cuisine').val('').trigger('change');
            $('#ex4-country').val('').trigger('change');
            $('#ex4-category').val('').trigger('change');
        });
    });

    //------------------------------
    // run all tests
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };
    jasmineEnv.execute();
});
