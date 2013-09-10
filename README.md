<!--
(remove-hook 'before-save-hook 'delete-trailing-whitespace)
(add-hook 'before-save-hook 'delete-trailing-whitespace)
https://github.com/monmonmon/jquery.narrows
-->

# jQuery Select Narrowing Plugin（select 絞り込みプラグイン）

* Version: 0.2
* Author: Simon Yamada 山田史門

## これはなに？

いわゆる hierselect プラグインです。
複数の select 間に階層関係を持たせて、ある select での選択結果により別の select の選択肢を絞り込ませる (narrows) ことができます。

## ウリ

* サーバサイドの実装なしに、JS と HTML だけで動作します。
* 単純な「親→子」だけでなく、「親→子→孫→ひ孫…」と、何階層でも連鎖させられます。  
国→エリア→都市、とか。
* 「親→子1＆子2」のように、1つの親 select に複数の子 select を持たせられます。
* 「親1＆親2→子」のように、複数の親 select の選択結果により子 select の選択肢を絞り込んだり出来ます。  
例えば select1 で色を、select2 で形をそれぞれ選択して、select3 の選択肢を絞り込んだりとか出来ます。
* これらを応用して、いくらでも複雑な階層関係を表現出来ます。出来るはず。

## 例

ぐだぐだ説明するより付属のサンプルを見て頂いた方が分かりやすいかと思います。。。  
clone して同梱の sample.html を開いて下さい。

## 制約

* 使用する select は全て（親selectも子selectも）id 属性を持つ必要があります。
<!-- * 子 select の option に独自データ属性 (data-*) を持たせることで親子関係を記述します。 -->
* select の option を動的に追加・削除するようなコードやプラグインとは併用できないです。  
  階層関係の初期化時に、子 select の option をメモリ中に全てキャッシュしてるためです。

## 使い方

付属のサンプルを参考にして下さい。。。`_(:3｣∠)_`  
そのうちちゃんと書きますってば。。。`_(|3｣∠)_`

## 対応ブラウザ

* Google Chrome 29+
* Firefox 20+
* Opera 12+
* Safari 6+

で動作確認。全て MacOSX 上でテストしています。Windows では未テスト（笑）

## License

Dual licensed under the [MIT](http://www.opensource.org/licenses/MIT) and [GPL](http://www.gnu.org/licenses/gpl.html) licenses:

Copyright 2013 Simon Yamada
