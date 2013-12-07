<!--
(remove-hook 'before-save-hook 'delete-trailing-whitespace)
(add-hook 'before-save-hook 'delete-trailing-whitespace)
https://github.com/monmonmon/jquery.narrows
-->

# jQuery Select Narrowing Plugin<br>（select 絞り込みプラグイン）

* Version: 0.3
* Author: Shimon Yamada

## これはなに？

いわゆる hierselect プラグインです。
複数の select 間に階層関係を持たせて、ある select での選択結果により別の select の選択肢を絞り込ませる (narrows) ことができます。

## 例

ぐだぐだ説明するよりまずサンプルを触って貰った方が分かりやすいかと思います。。。
→ [sample.html](http://monmonmon.github.io/jquery.narrows/sample.html)

## ウリ

* サーバサイドの実装なしに、JS と HTML だけで動作します。サーバサイドが PHP だろうが Ruby だろうが Java だろうが関係なく動きます。素敵。
* 単純な「親→子」だけでなく、「親→子→孫→ひ孫…」と、何階層でも連鎖させられます。
国→エリア→都市、とか。
* 「親→子1＆子2」のように、1つの親 select に複数の子 select を持たせられます。
* 「親1＆親2→子」のように、複数の親 select の選択結果により子 select の選択肢を絞り込んだりできます。
例えば select1 で色を、select2 で形をそれぞれ選択して、select3 の選択肢を絞り込んだりとか。
* これらを組み合わせて、いくらでも複雑な階層関係を表現できます。できるはず。あまり複雑な階層関係で実験したことないですけど。。。

## 制約

* 使用する select（親selectも子selectも）は全て id 属性が必須です。
* 子 select の option には独自のデータ属性 (data-xx="yy" のような属性) を設定する必要があります。
* select の option を動的に追加・削除しています。このような動作と競合するようなライブラリやスクリプトとは共存できません。
* optgroup のある select には未対応です。

## 使い方

### ☆ 使い方その1 ☆

シンプルな例。

まず HTML で select を記述します。この例では、食品カテゴリと食品の2つの select を作ります。
階層関係は、この select, option の HTML 属性で定義します。

* 親子とも、select 要素の id 属性は必須です。ここでは親 select を **"category"**, 子 select を **"food"** とします。
* 子 select の option のデータ属性（**"data-xx"** てやつ）で、どの親 select のどの値で絞り込むか、を定義します。
    * データ属性名は **"data-<親 select の id 名>"** です。親 select の id は category なので、この場合のデータ属性名は **data-category** です。
    * このデータ属性は、子 select の value="" 以外の全ての option で必須です。
    * このデータ属性の値で、親 select のどの値の時に有効となるかを定義します。
      data-category="meat" なら、親 select で value="meat" が選択された時に有効になります。

<!-- 箇条書きここまで -->

    <!-- 親select：食品カテゴリ -->
	<select id="category">							← id="category"
		<option value="">-- Food Category --</option>	← 空の value の option は必ず value="" と明示して下さい
		<option value="meat">Meat</option>
		<option value="vegetable">Vegetable</option>
		<option value="fruit">Fruit</option>
	</select>
    <!-- 子select：食品 -->
	<select id="food">								← id="food"
		<option value="">-- Food --</option>
		<option value="beef" data-category="meat">Beef</option>			← select#category で meat 選択時に有効
		<option value="pork" data-category="meat">Pork</option>
		<option value="chicken" data-category="meat">Chicken</option>
		<option value="lettuce" data-category="vegetable">Lettuce</option>	← select#category で vegetable 選択時に有効
		<option value="carrot" data-category="vegetable">Carrot</option>
		<option value="tomato" data-category="vegetable">Tomato</option>
		<option value="apple" data-category="fruit">Apple</option>		← select#category で fruit 選択時に有効
		<option value="banana" data-category="fruit">Banana</option>
		<option value="melon" data-category="fruit">Melon</option>
	</select>

jQuery プラグインで階層関係を登録します。以下のように呼ぶだけです。

	<script type="text/javascript">
	$(function () {
		$("#category").narrows("#food");		// category は food を絞り込む
	});
	</script>



### ☆ 使い方その2 ☆

3階層の例です。大陸→国→都市。

    <!-- 親select：大陸 -->
	<select id="continent">
		<option value="">-- Continent --</option>
		<option value="asia">Asia</option>
		<option value="europa">Europa</option>
	</select>
    <!-- 子select：国 -->
	<select id="country">
		<option value="">-- Country --</option>
		<option value="japan" data-continent="asia">Japan</option>
		<option value="korea" data-continent="asia">Korea</option>
		<option value="china" data-continent="asia">China</option>
		<option value="uk" data-continent="europa">UK</option>
		<option value="france" data-continent="europa">France</option>
		<option value="german" data-continent="europa">German</option>
	</select>
    <!-- 孫select：都市 -->
	<select id="city">
		<option value="">-- City --</option>
		<option value="tokyo" data-country="japan">Tokyo</option>
		<option value="osaka" data-country="japan">Osaka</option>
		<option value="seoul" data-country="korea">Seoul</option>
		<option value="busan" data-country="korea">Busan</option>
		<option value="peking" data-country="china">Peking</option>
		<option value="shanghai" data-country="china">Shanghai</option>
		<option value="london" data-country="uk">London</option>
		<option value="paris" data-country="france">Paris</option>
		<option value="berlin" data-country="german">Berlin</option>
	</select>

プラグインは2回呼びます。

	<script type="text/javascript">
	$(function () {
		$("#continent").narrows("#country");	// continent は country を絞り込む
		$("#country").narrows("#city");			// country は city を絞り込む
	});
	</script>



### ☆ 使い方その3 ☆

1つの親 select が複数の子 select を同時に絞り込む例。

国籍を選択すると、その国籍の料理、酒がそれぞれ選択できるようになる。

	<!-- 親select：国籍 -->
	<select id="cuisine">
		<option value="">-- Cuisine --</option>
		<option value="japanese">Japanese</option>
		<option value="chinese">Chinese</option>
		<option value="korean">Korean</option>
	</select>
	<!-- 子select1：料理 -->
	<select id="food">
		<option value="">-- Food --</option>
		<option value="sushi" data-cuisine="japanese">Sushi</option>
		<option value="tempura" data-cuisine="japanese">Tempura</option>
		<option value="soba-noodle" data-cuisine="japanese">Soba Noodle</option>
		<option value="stir-fried-rice" data-cuisine="chinese">Stir-fried Rice</option>
		<option value="twice-cooked-pork" data-cuisine="chinese">Twice Cooked Pork</option>
		<option value="dumpling" data-cuisine="chinese">Dumpling</option>
		<option value="bulgogi" data-cuisine="korean">Bulgogi</option>
		<option value="bibimbap" data-cuisine="korean">Bibimbap</option>
		<option value="kimchi" data-cuisine="korean">Kimchi</option>
	</select>
	<!-- 子select2：酒 -->
	<select id="alcohol">
		<option value="">-- Alcohol --</option>
		<option value="sake" data-cuisine="japanese">Sake</option>
		<option value="asahi-beer" data-cuisine="japanese">Asahi Beer</option>
		<option value="kirin-beer" data-cuisine="japanese">Kirin Beer</option>
		<option value="sapporo-beer" data-cuisine="japanese">Sapporo Beer</option>
		<option value="ebisu-beer" data-cuisine="japanese">Ebisu Beer</option>
		<option value="huangjiu" data-cuisine="chinese">Huangjiu</option>
		<option value="baijiu" data-cuisine="chinese">Baijiu</option>
		<option value="tsingtao-beer" data-cuisine="chinese">Tsingtao Beer</option>
		<option value="soju" data-cuisine="korean">Soju</option>
		<option value="makgeolli" data-cuisine="korean">Makgeolli</option>
		<option value="hite-jinro-beer" data-cuisine="korean">Hite-Jinro Beer</option>
	</select>

<!-- separator -->

	<script type="text/javascript">
	$(function () {
		$("#cuisine").narrows("#food, #alcohol");	// cuisine は food, alcohol を同時に絞り込む
		// こうも書けるけど非推奨
		//$("#cuisine").narrows("#food");			// cuisine は food を絞り込む
		//$("#cuisine").narrows("#alcohol");		// cuisine は alcohol を絞り込む
	});
	</script>



### ☆ 使い方その4 ☆

複数の親 select の選択結果により子 select を絞り込む例。

国籍とカテゴリを選択すると、選んだ国、カテゴリに対応する食べ物が選択できるようになる。
親が複数の場合は、子 select の option に与えるデータ属性 **data-xx** が同じ数だけ必要になります。
この例では親 select は id-"country", id="category" なので、子 select の option には data-country, data-category の2つのデータ属性を与えます。

	<!-- 親select1：国籍 -->
	<select id="country">
		<option value="">-- Country --</option>
		<option value="japanese">Japanese</option>
		<option value="chinese">Chinese</option>
		<option value="korean">Korean</option>
	</select>
	<!-- 親select2：カテゴリ -->
	<select id="category">
		<option value="">-- Category --</option>
		<option value="food">Food</option>
		<option value="liquor">Liquor</option>
		<option value="soft-drink">Soft Drink</option>
	</select>
	<!-- 子select：食べ物 -->
	<select id="menu">
		<option value="">-- Menu --</option>
		<option value="sushi"      data-country="japanese" data-category="food">Sushi</option>
		<option value="tempura"    data-country="japanese" data-category="food">Tempura</option>
		<option value="udon"       data-country="japanese" data-category="food">Udon</option>
		<option value="sake"       data-country="japanese" data-category="liquor">Sake</option>
		<option value="ebisu-beer" data-country="japanese" data-category="liquor">Ebisu Beer</option>
		<option value="green-tea"  data-country="japanese" data-category="soft-drink">Green Tea</option>
		<option value="dumpling"   data-country="chinese"  data-category="food">Dumpling</option>
		<option value="huangjiu"   data-country="chinese"  data-category="liquor">Huangjiu</option>
		<option value="oolong-tea" data-country="chinese"  data-category="soft-drink">Oolong Tea</option>
		<option value="bulgogi"    data-country="korean"   data-category="food">Bulgogi</option>
		<option value="makgeolli"  data-country="korean"   data-category="liquor">Makgeolli</option>
		<option value="sikhye"     data-country="korean"   data-category="soft-drink">Sikhye</option>
	</select>

<!-- separator -->

	<script type="text/javascript">
	$(function () {
		$("#country, #category").narrows("#menu");		// country, category は menu を絞り込む
	});
	</script>

## オプション

第2引数にオプションを指定できます。

	$("#parent").narrows("#child", {
		disable_if_parent_is_null: true,
		null_value: '',
		allow_multiple_parent_values: false,
		multiple_parent_values_separator: ' *, *',
	});

<table>
  <tr>
    <th>オプション</th>
    <th>型</th>
    <th>デフォルト値</th>
    <th>説明</th>
  </tr>
  <tr>
    <td>disable_if_parent_is_null</td>
    <td>boolean</td>
    <td>true</td>
    <td>
      true ... 親selectで value="" を選択した場合、子selectを選択不可とする。<br>
      false ... 親selectで value="" を選択した場合、子selectで全てのoptionを選択可とする。
    </td>
  </tr>
  <tr>
    <td>null_value</td>
    <td>string</td>
    <td>''</td>
    <td>
      option の value 属性が空値だと判断する値。<br>
      null_value を 0 とすると value="0" の時に空値と判断する。
    </td>
  </tr>
  <tr>
    <td>allow_multiple_parent_values</td>
    <td>boolean</td>
    <td>false</td>
    <td>
      子selectのoptionの data-xx 属性に複数の値を指定することで、親selectの複数のoptionにマッチ可能とする。
    </td>
  </tr>
  <tr>
    <td>multiple_parent_values_separator</td>
    <td>string</td>
    <td>' *, *'</td>
    <td>
      allow_multiple_parent_values オプションが true の際、data-xx 属性の複数の値を分割するセパレータ（正規表現）。
    </td>
  </tr>
</table>

## 対応ブラウザ

MacOSX

* Google Chrome 29+
* Firefox 20+
* Opera 12+
* Safari 6+

Windows

* Internet Explorer 6
* Firefox 10くらい

で動作確認。

## License

Licensed under the [MIT](http://www.opensource.org/licenses/MIT) license.

Copyright 2013 Shimon Yamada
