<article class="article-body">
  <p>
    「あの資料、どこにあったっけ」。窓口対応の合間に共有フォルダを開き、前任者が残した引き継ぎメモや、数年前の議事録を探して回った経験はないでしょうか。たしかにあるはずなのに、検索しても出てこない。結局、詳しい人に聞いて回るのがいちばん早い——。多くの職場で毎日起きている光景です。
  </p>
  <p>
    Vecta
    が向き合っているのは、まさにこの「探しても見つからない」という問題です。その鍵になるのが、この記事の主役である「ベクトルデータ」。専門用語をできるだけ使わずに、仕組みと役立ち方をご紹介します。
  </p>

  <h2>キーワード検索は「同じ言葉」しか見つけられない</h2>

  <p>
    ふだん使っている検索の多くは「キーワード検索」です。入力した言葉と同じ言葉が入った資料を探し出す仕組みで、言葉がぴったり一致すれば速くて確実です。
  </p>
  <p>
    ところが、探すときの言葉と資料の中の言葉が少しでも違うと、とたんに見つからなくなります。たとえば「保育園」で検索すると、「こども園」や「一時預かり」について書かれた資料は、内容がどれだけ関係していても検索結果に出てきません。コンピュータは文字の並びが同じかどうかだけを見ていて、言葉の「意味」までは見ていないからです。
  </p>

  <figure class="article-figure">
    <svg
      viewBox="0 0 400 624"
      role="img"
      aria-label="キーワード検索と意味で探す検索の比較図。キーワード検索では『保育園』と同じ言葉を含む資料だけが見つかるが、意味で探す検索ではこども園や一時預かりの資料も見つかる"
    >
      <rect
        x="8"
        y="8"
        width="384"
        height="294"
        rx="12"
        fill="var(--color-paper)"
        stroke="var(--color-line)"
      />
      <text
        x="20"
        y="40"
        font-size="19"
        font-weight="700"
        fill="var(--color-indigo)"
      >
        ① キーワード検索
      </text>
      <rect
        x="20"
        y="58"
        width="160"
        height="34"
        rx="17"
        fill="var(--color-white)"
        stroke="var(--color-line-strong)"
      />
      <text
        x="100"
        y="80"
        font-size="14"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        「保育園」で探す
      </text>
      <rect
        x="20"
        y="106"
        width="352"
        height="52"
        rx="8"
        fill="var(--color-white)"
        stroke="var(--color-gold)"
        stroke-width="2"
      />
      <text x="36" y="138" font-size="15" fill="var(--color-sumi)">
        保育園のご案内
      </text>
      <text
        x="356"
        y="138"
        font-size="13"
        font-weight="700"
        text-anchor="end"
        fill="var(--figure-accent-text)"
      >
        ○ 見つかる
      </text>
      <rect
        x="20"
        y="170"
        width="352"
        height="52"
        rx="8"
        fill="var(--color-white)"
        stroke="var(--color-border-medium)"
        stroke-dasharray="4 3"
      />
      <text x="36" y="202" font-size="15" fill="var(--color-medium-text)">
        こども園の入園手続き
      </text>
      <text
        x="356"
        y="202"
        font-size="13"
        font-weight="700"
        text-anchor="end"
        fill="var(--color-medium-text)"
      >
        ✕ 見つからない
      </text>
      <rect
        x="20"
        y="234"
        width="352"
        height="52"
        rx="8"
        fill="var(--color-white)"
        stroke="var(--color-border-medium)"
        stroke-dasharray="4 3"
      />
      <text x="36" y="266" font-size="15" fill="var(--color-medium-text)">
        一時預かりのしおり
      </text>
      <text
        x="356"
        y="266"
        font-size="13"
        font-weight="700"
        text-anchor="end"
        fill="var(--color-medium-text)"
      >
        ✕ 見つからない
      </text>
      <rect
        x="8"
        y="322"
        width="384"
        height="294"
        rx="12"
        fill="var(--color-paper)"
        stroke="var(--color-line)"
      />
      <text
        x="20"
        y="354"
        font-size="19"
        font-weight="700"
        fill="var(--color-indigo)"
      >
        ② 意味で探す検索
      </text>
      <rect
        x="20"
        y="372"
        width="160"
        height="34"
        rx="17"
        fill="var(--color-white)"
        stroke="var(--color-line-strong)"
      />
      <text
        x="100"
        y="394"
        font-size="14"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        「保育園」で探す
      </text>
      <rect
        x="20"
        y="420"
        width="352"
        height="52"
        rx="8"
        fill="var(--color-white)"
        stroke="var(--color-gold)"
        stroke-width="2"
      />
      <text x="36" y="452" font-size="15" fill="var(--color-sumi)">
        保育園のご案内
      </text>
      <text
        x="356"
        y="452"
        font-size="13"
        font-weight="700"
        text-anchor="end"
        fill="var(--figure-accent-text)"
      >
        ○ 見つかる
      </text>
      <rect
        x="20"
        y="484"
        width="352"
        height="52"
        rx="8"
        fill="var(--color-white)"
        stroke="var(--color-gold)"
        stroke-width="2"
      />
      <text x="36" y="516" font-size="15" fill="var(--color-sumi)">
        こども園の入園手続き
      </text>
      <text
        x="356"
        y="516"
        font-size="13"
        font-weight="700"
        text-anchor="end"
        fill="var(--figure-accent-text)"
      >
        ○ 見つかる
      </text>
      <rect
        x="20"
        y="548"
        width="352"
        height="52"
        rx="8"
        fill="var(--color-white)"
        stroke="var(--color-gold)"
        stroke-width="2"
      />
      <text x="36" y="580" font-size="15" fill="var(--color-sumi)">
        一時預かりのしおり
      </text>
      <text
        x="356"
        y="580"
        font-size="13"
        font-weight="700"
        text-anchor="end"
        fill="var(--figure-accent-text)"
      >
        ○ 見つかる
      </text>
    </svg>
    <figcaption>
      同じ言葉で探しても、キーワード検索では言い回しの違う資料を見落とします。意味で探すと、つながりのある資料まで見つかります。
    </figcaption>
  </figure>

  <p>
    住民の言葉と行政の言葉が違う、部署ごとに言い回しが違う、昔と今で名称が変わった——。役所の情報はこうした「言葉のずれ」の宝庫です。だからこそ、キーワード検索だけでは、せっかく蓄積された知識にたどり着けないことが起きます。
  </p>

  <h2>ベクトルデータとは——言葉を「意味の地図」に置く技術</h2>

  <p>
    そこで登場するのがベクトルデータです。難しそうな名前ですが、考え方はシンプルです。ベクトルデータとは、文章や画像がもつ「意味」を数値の組に置き換えたもの。たとえるなら、あらゆる言葉や資料を1枚の大きな地図の上に配置するための「住所」のようなものです。
  </p>
  <p>
    この地図には、大切なルールがひとつあります。<strong
      >意味が近いものほど、地図の上で近くに置かれる</strong
    >のです。「保育園」「こども園」「一時預かり」は地図の上でご近所どうしに集まり、「避難所」や「ハザードマップ」は別の場所に寄り集まります。
  </p>

  <figure class="article-figure">
    <svg
      viewBox="0 0 480 420"
      role="img"
      aria-label="言葉を配置した意味の地図の図。保育園・こども園・一時預かりが近くに集まり、避難所・ハザードマップが別の場所に集まり、道路の補修は遠くに置かれている"
    >
      <rect
        x="8"
        y="8"
        width="464"
        height="404"
        rx="12"
        fill="var(--color-paper)"
        stroke="var(--color-line)"
      />
      <text x="24" y="34" font-size="15" fill="var(--color-medium-text)">
        ことばの地図（イメージ）
      </text>
      <ellipse
        cx="140"
        cy="150"
        rx="105"
        ry="85"
        fill="none"
        stroke="var(--color-gold)"
        stroke-dasharray="6 5"
      />
      <text
        x="140"
        y="52"
        font-size="16"
        font-weight="700"
        text-anchor="middle"
        fill="var(--figure-accent-text)"
      >
        子育てのことば
      </text>
      <circle cx="95" cy="128" r="6" fill="var(--color-gold)" />
      <text
        x="95"
        y="152"
        font-size="16"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        保育園
      </text>
      <circle cx="180" cy="108" r="6" fill="var(--color-gold)" />
      <text
        x="180"
        y="132"
        font-size="16"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        こども園
      </text>
      <circle cx="135" cy="192" r="6" fill="var(--color-gold)" />
      <text
        x="135"
        y="216"
        font-size="16"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        一時預かり
      </text>
      <ellipse
        cx="355"
        cy="135"
        rx="100"
        ry="70"
        fill="none"
        stroke="var(--color-vector-blue)"
        stroke-dasharray="6 5"
      />
      <text
        x="355"
        y="46"
        font-size="16"
        font-weight="700"
        text-anchor="middle"
        fill="var(--color-vector-blue)"
      >
        防災のことば
      </text>
      <circle cx="320" cy="118" r="6" fill="var(--color-vector-blue)" />
      <text
        x="320"
        y="142"
        font-size="16"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        避難所
      </text>
      <circle cx="370" cy="155" r="6" fill="var(--color-vector-blue)" />
      <text
        x="370"
        y="179"
        font-size="16"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        ハザードマップ
      </text>
      <line
        x1="215"
        y1="225"
        x2="365"
        y2="340"
        stroke="var(--color-medium-text)"
        stroke-dasharray="4 4"
      />
      <circle cx="390" cy="352" r="6" fill="var(--color-medium-text)" />
      <text
        x="390"
        y="376"
        font-size="16"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        道路の補修
      </text>
      <text x="24" y="398" font-size="15" fill="var(--color-medium-text)">
        意味が近いことばほど、近くに置かれる
      </text>
    </svg>
    <figcaption>
      ベクトルデータのイメージ。言葉や資料は「意味の地図」の上に置かれ、意味が近いものほど近くに集まります。
    </figcaption>
  </figure>

  <p>
    こうして地図ができあがると、探しものの方法が変わります。「同じ言葉を含む資料」を探すのではなく、「地図の上で近くにある資料」を拾えばよくなるのです。「保育園」で探せば、言葉こそ違う「こども園」の資料もすぐ隣で見つかる。これが「意味で探す検索」の正体で、AI
    の分野では「ベクトル検索」と呼ばれています。
  </p>

  <h2>自治体の現場で、どう役立つのか</h2>

  <p>
    ベクトルデータが力を発揮する場面は、特別なものではありません。日々の業務のすぐそばにあります。
  </p>

  <ul>
    <li>
      <strong>庁内の資料探し</strong>:
      言い回しや名称が違っても、過去の起案文書・議事録・要綱にたどり着けます。「探す時間」がそのまま短くなります。
    </li>
    <li>
      <strong>窓口や電話の問い合わせ対応</strong>:
      「子どもを預けたい」という住民の自然な言葉から、「一時預かり事業」という正式な制度の案内へつなげられます。
    </li>
    <li>
      <strong>ベテランの知識の引き継ぎ</strong>:
      経験豊富な職員が残したメモやマニュアルを、後任が自分の言葉のまま探せるようになります。
    </li>
  </ul>

  <p>
    さらに、いま多くの自治体で導入が進む生成 AI とも深い関係があります。AI
    が問い合わせに正確に答えるには、その前に「根拠となる正しい資料を見つける」ことが欠かせません。この「見つける」役割を担うのがベクトルデータです。総務省の「自治体における
    AI
    活用・導入ガイドブック」でも、庁内の文書やマニュアルを検索して回答に生かす活用が紹介されており、その土台にはこの仕組みがあります。
  </p>

  <figure class="article-figure">
    <svg
      viewBox="0 0 400 342"
      role="img"
      aria-label="AI が答えるまでの流れ図。質問を受け、ことばの地図から意味の近い資料を探し、見つかった資料をもとに AI が回答する"
    >
      <rect
        x="20"
        y="20"
        width="360"
        height="56"
        rx="10"
        fill="var(--color-white)"
        stroke="var(--color-line-strong)"
      />
      <text
        x="200"
        y="55"
        font-size="15"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        ① 質問「子どもを預けたい」
      </text>
      <line
        x1="200"
        y1="76"
        x2="200"
        y2="92"
        stroke="var(--color-medium-text)"
      />
      <polygon points="192,92 208,92 200,102" fill="var(--color-medium-text)" />
      <rect
        x="20"
        y="102"
        width="360"
        height="56"
        rx="10"
        fill="var(--color-amber-soft)"
        stroke="var(--color-gold)"
      />
      <text
        x="200"
        y="137"
        font-size="15"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        ② ことばの地図から、意味の近い資料を探す
      </text>
      <line
        x1="200"
        y1="158"
        x2="200"
        y2="174"
        stroke="var(--color-medium-text)"
      />
      <polygon
        points="192,174 208,174 200,184"
        fill="var(--color-medium-text)"
      />
      <rect
        x="20"
        y="184"
        width="360"
        height="56"
        rx="10"
        fill="var(--color-white)"
        stroke="var(--color-line-strong)"
      />
      <text
        x="200"
        y="219"
        font-size="15"
        text-anchor="middle"
        fill="var(--color-sumi)"
      >
        ③「一時預かり」などの資料が見つかる
      </text>
      <line
        x1="200"
        y1="240"
        x2="200"
        y2="256"
        stroke="var(--color-medium-text)"
      />
      <polygon
        points="192,256 208,256 200,266"
        fill="var(--color-medium-text)"
      />
      <rect
        x="20"
        y="266"
        width="360"
        height="56"
        rx="10"
        fill="var(--color-vector-blue-soft)"
        stroke="var(--color-vector-blue)"
      />
      <text
        x="200"
        y="301"
        font-size="15"
        text-anchor="middle"
        fill="var(--color-indigo)"
      >
        ④ AI が資料をもとに回答する
      </text>
    </svg>
    <figcaption>
      生成 AI
      が問い合わせに答えるまでの流れ。「意味の近い資料を探す」部分をベクトルデータが支えます。
    </figcaption>
  </figure>

  <h2>Vecta の土台にある技術——Qdrant</h2>

  <p>
    ここまでの仕組みを実際に動かすには、大量のベクトルデータを保管し、「地図の上で近くにあるもの」を一瞬で探し出す、専用の保管庫が必要です。Vecta
    はその保管庫として、<a href="https://qdrant.tech/"
      >Qdrant（クワッドラント）</a
    >を採用しています。設計図が公開され、世界中の技術者が改良を重ねている「オープンソース」と呼ばれる形で開発されている、信頼性の高い技術です。
  </p>
  <p>
    とはいえ、利用する皆さまが Qdrant
    の仕組みを詳しく知る必要はありません。よい道具は、中身を知らなくても安心して使えるものです。技術は私たちが預かり、まちには「必要な情報にすぐたどり着ける」という体験をお届けします。
  </p>

  <h2>おわりに</h2>

  <p>
    紙、PDF、議事録、ベテランの経験。まちには、キーワード検索では拾いきれない知識がたくさん眠っています。ベクトルデータは、それらを「意味」でつなぎ直し、必要な人へ届けるための技術です。Vecta
    はこの技術を土台に、自治体の現場に寄り添ったサービスづくりを進めていきます。
  </p>
</article>

<style>
  .article-figure {
    /* --color-gold は白地の文字ではコントラスト不足（約2.3:1）のため、図中テキスト用に暗めの金色（約4.9:1）を定義 */
    --figure-accent-text: #9c6300;

    margin: 2.25rem 0;
  }

  .article-figure svg {
    display: block;
    width: 100%;
    max-width: 520px;
    height: auto;
    margin-inline: auto;
    border: 1px solid var(--color-line);
    border-radius: 8px;
    background: var(--color-white);
  }

  .article-figure text {
    font-family: inherit;
  }

  .article-figure figcaption {
    margin-top: 0.6rem;
    color: var(--color-medium-text);
    font-size: 0.88rem;
    line-height: 1.7;
    text-align: center;
  }
</style>
