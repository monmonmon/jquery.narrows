<!--
(remove-hook 'before-save-hook 'delete-trailing-whitespace)
(add-hook 'before-save-hook 'delete-trailing-whitespace)
-->

# jQuery Select-Narrowing Plugin （select 絞り込みプラグイン）
* Version: 0.1
* Author: Simon Yamada

## これはなあに？
ペアとなる２つの select 要素間に親子関係を定義し、親 select での選択結果が子 select の選択肢を絞り込む（narrows）ようにさせられるプラグインです。

### できること
* 親→子→孫→…　と、いくつでも連鎖させられます。
* 親→子１、親→子２、…　のように、１つの親 select に複数の子 select を同時に定義できます。

### できないこと
* （親１＆親２）→子　のように、複数の親の選択結果で１つの子の選択肢を絞り込むことはできません。  
例えば select1 で色を、select2 で形をそれぞれ選択して、select3 の選択肢に反映するようなことはできないです。今後の課題。

## 使い方

### 1. HTML で親子関係を定義

select 間の親子関係を定義するには、option 要素の **"data-parent-value"** 属性で指定してやります。

1.  いつものよーに select を書きます。
各 option 要素に value 属性で値を持たせて下さい。  
**value のない option は、必ず「value=""」とすること。**
2.  子 select の option の **"data-parent-value"** 属性に、対応する親 option の value 値を持たせます。こうすることで、親が誰かを記述します。  
何言ってるか分かりませんか？ 分かりませんよね。早い話が↓のように書きます。

		<select id="food-category">
		  <option value="">-- Food Category --</option><!-- 未選択状態を表す option では必ず value="" と明示 -->
		  <option value="meat">Meat</option>
		  <option value="vegetable">Vegetable</option>
		</select>
		<select id="food-item">
		  <option value="">-- Food --</option>
		  <option value="beef" data-parent-value="meat">Beef</option><!-- 子 option の data-parent-value 属性に、親 option の value 値をセットします -->
		  <option value="pork" data-parent-value="meat">Pork</option>
		  <option value="chicken" data-parent-value="meat">Chicken</option>
		  <option value="lettuce" data-parent-value="vegetable">Lettuce</option>
		  <option value="carrot" data-parent-value="vegetable">Carrot</option>
		  <option value="tomato" data-parent-value="vegetable">Tomato</option>
		</select>

### 2. jQuery プラグインで親子関係を登録

HTML を書いたら、jQuery プラグインで親子関係を登録します。

*   基本の「親→子」関係

		$("select#food-category").narrows("select#food-item");     // 子を selector で指定
		// または
		$("select#food-category").narrows($("select#food-item"));  // 子を jQuery オブジェクトで渡す

*   「親→子→孫」と定義するにはプラグインを２回呼びます。

		// 親→子
		$("select#continent").narrows("select#country");
		// 子→孫
		$("select#country").narrows("select#city");

*   「親→子１、親→子２」。１つの親に複数の子。

		// 親→子１
		$("select#cuisine").narrows("select#food");
		// 親→子２
		$("select#cuisine").narrows("select#alcohol");


## 対応ブラウザ
* Google Chrome
* Firefox 20+
* Opera 12+
* Safari 6+

で動作確認。全て MacOS 10.7.5 上でテストしています。  
Windows 上では未テストですがまー動くんじゃーないでしょうか（適当）

## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).

Copyright 2013 Simon Yamada
