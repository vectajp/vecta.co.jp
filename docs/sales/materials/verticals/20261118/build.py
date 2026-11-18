"""Build the two A4 duplex brochures using approved Swarrow artwork and real UI."""

from html import escape
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
REFERENCE = ROOT.parent.parent / 'revisions/20261027-chat-voice-news/brochure/assets'
FONTS = Path.home() / 'Library/Fonts/CodexNotoCJK'
BUILD = ROOT / '.build'
BUILD.mkdir(exist_ok=True)


def image(name, cls='', alt=''):
    path = REFERENCE / name
    assert path.is_file(), path
    return f'<img class="{cls}" src="{path.as_uri()}" alt="{escape(alt)}">'


def icon(kind):
    shapes = {
        'page': '<rect x="9" y="5" width="27" height="37" rx="4"/><path d="M16 15h13M16 23h13M16 31h8"/>',
        'map': '<path d="m5 12 12-6 14 6 12-6v30l-12 6-14-6-12 6Z"/><path d="M17 6v30M31 12v30"/>',
        'chat': '<path d="M7 8h34v25H22L12 41v-8H7Z"/><path d="M15 17h18M15 24h12"/>',
        'gift': '<path d="M7 23h34v19H7ZM5 15h38v8H5ZM24 15v27"/><path d="M24 15C7 15 10 1 18 6c5 3 6 9 6 9Zm0 0C41 15 38 1 30 6c-5 3-6 9-6 9Z"/>',
        'check': '<path d="M24 4 42 11v13c0 11-18 20-18 20S6 35 6 24V11Z"/><path d="m15 23 6 6 13-15"/>',
        'search': '<circle cx="21" cy="20" r="13"/><path d="m31 31 11 11M14 20h14M21 13v14"/>',
        'globe': '<circle cx="24" cy="24" r="19"/><ellipse cx="24" cy="24" rx="9" ry="19"/><path d="M5 24h38M9 13h30M9 35h30"/>',
        'clock': '<circle cx="24" cy="24" r="19"/><path d="M24 12v13l9 5"/>',
    }
    return f'<svg viewBox="0 0 48 48" aria-hidden="true">{shapes[kind]}</svg>'


CSS = '''
@page{size:A4;margin:0}
@font-face{font-family:Noto;src:url("FONT_REGULAR");font-weight:400}
@font-face{font-family:Noto;src:url("FONT_BOLD");font-weight:700 900}
*{box-sizing:border-box}html,body{margin:0;padding:0;background:white;color:#092345;font-family:Noto,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-feature-settings:"palt" 1}
body{width:1055px}h1,h2,h3,p,figure{margin:0}a{color:inherit;text-decoration:none}img{display:block}svg{display:block}.source-row svg,.hub-icon svg,.proof-mark svg{fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.page{width:1055px;height:1491px;position:relative;overflow:hidden;background:white;break-after:page;--accent:#167b79;--light:#eaf6f3;--mid:#cce8df}.page:last-child{break-after:auto}.donation{--accent:#a95d24;--light:#fbf2e8;--mid:#f0dac2}
.header{position:absolute;left:50px;right:50px;top:30px}.audience{font-size:24px;font-weight:700;color:var(--accent);letter-spacing:.2px}.brand{display:flex;align-items:center;gap:16px;margin-top:16px}.brand img{width:76px;height:76px;object-fit:contain}.brand strong{font-size:62px;line-height:1.2;letter-spacing:-2.4px;font-feature-settings:normal}.back .brand{margin:0}.back .brand img{width:50px;height:50px}.back .brand strong{font-size:39px;letter-spacing:-1px}.edition{margin-left:auto;font-size:17px;font-weight:700;color:var(--accent)}
.headline{position:absolute;left:50px;right:50px;top:192px;font-size:38px;line-height:1.4;font-weight:800;letter-spacing:-.8px}.lead{position:absolute;left:50px;right:50px;top:253px;font-size:22px;line-height:1.7;color:#3a526a}
.features{position:absolute;left:50px;right:50px;top:876px;display:grid;grid-template-columns:1fr 1fr;gap:30px 32px}.feature{display:grid;grid-template-columns:68px 1fr;gap:14px;min-height:154px}.feature-art{height:68px;width:68px;border:1px solid #dce9ee;border-radius:18px;background:#f2f9fd;overflow:hidden}.feature-art svg{height:66px;width:66px}.feature h3{font-size:25px;line-height:1.5;letter-spacing:-.55px}.feature p{font-size:20px;line-height:1.65;color:#3a526a;margin-top:7px}
.proof{position:absolute;left:0;right:0;top:1252px;height:184px;background:#edf6ff;padding:21px 50px;display:grid;grid-template-columns:98px 1fr;gap:22px;align-items:center}.proof-mark{height:98px;width:98px;display:grid;place-items:center;border-radius:20px;background:#fff;color:#2c7cbb}.proof-mark svg{width:65px;height:65px}.proof h2{font-size:27px;line-height:1.5}.proof p{font-size:18px;line-height:1.6;margin-top:8px;color:#395873}.proof small{font-size:15px;display:block;margin-top:7px;color:#52677d}
.footer{position:absolute;left:0;right:0;bottom:0;height:55px;padding:0 42px;display:flex;align-items:center;background:#092b50;color:white;font-size:16px}.footer .url{margin-left:22px}.footer .provider{margin-left:auto}.footer .number{margin-left:24px}
.back .headline{top:115px;font-size:35px}.back .lead{top:176px;font-size:21px}.diagram{position:absolute;left:40px;right:40px;top:253px;height:417px;padding:25px 25px;background:var(--light);border:1px solid #e2eaf0;border-radius:20px}.diagram h2{font-size:23px;line-height:1.4}.diagram-grid{display:grid;grid-template-columns:242px 48px 269px 48px 273px;align-items:center;margin-top:20px}.diagram-grid.site{grid-template-columns:260px 56px 252px 56px 256px}.source-stack{display:grid;gap:12px}.source-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:white;border:1px solid #d9e6e9;border-radius:9px;font-size:18px;font-weight:700;min-height:60px}.source-row svg{width:31px;height:31px;color:var(--accent);flex:none}.flow-arrow{font-size:38px;text-align:center;font-weight:700;color:var(--accent)}.hub{height:220px;border:1.5px solid var(--accent);border-radius:15px;background:white;text-align:center;padding:23px 15px}.hub .hub-icon{margin:0 auto 13px;width:55px;height:55px;padding:8px;border-radius:15px;background:var(--light);color:var(--accent)}.hub .hub-icon svg{width:39px;height:39px}.hub strong{font-size:25px;line-height:1.5;display:block}.hub p{font-size:18px;line-height:1.65;margin-top:10px;color:#3a526a}.flow-note{font-size:16px;line-height:1.6;margin-top:17px;color:#51687a}.outcomes{display:grid;gap:12px}.outcomes .source-row{font-size:18px}.diagram-grid.site .hub{height:219px}.site .hub strong{font-size:23px}.site .source-row{font-size:18px}.split-note{position:absolute;left:50px;right:50px;top:692px;display:grid;grid-template-columns:1fr 1fr;gap:32px}.split-note h2{font-size:24px;line-height:1.5;margin-bottom:10px}.split-note p{font-size:19px;line-height:1.7;color:#3a526a}.split-note .badge{display:inline-block;padding:3px 10px;background:var(--light);border-radius:5px;color:var(--accent);font-size:15px;margin-right:8px;vertical-align:middle}
.steps{position:absolute;left:50px;right:50px;top:889px}.steps h2{font-size:27px;line-height:1.5}.step-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-top:18px}.step{border-top:3px solid var(--mid);padding-top:15px;min-height:155px}.step-label{display:flex;gap:12px;align-items:center;font-size:22px;font-weight:700}.step-label span{color:var(--accent);font-size:27px}.step p{font-size:19px;line-height:1.65;margin-top:10px;color:#3a526a}.scope{position:absolute;left:40px;right:40px;top:1128px;min-height:143px;border:1px solid #dce6ec;background:#f6f9fc;border-radius:14px;padding:18px 24px}.scope h2{font-size:21px;line-height:1.5}.scope p{font-size:18px;line-height:1.7;margin-top:7px;color:#3a526a}.scope strong{color:var(--accent)}
.contact{position:absolute;left:40px;right:40px;top:1291px;height:122px;border-radius:14px;background:#0b335c;color:white;display:flex;align-items:center;padding:22px 26px;gap:25px}.contact-copy{flex:1}.contact p{font-size:18px;line-height:1.5}.contact .mail{display:inline-block;font-size:29px;font-weight:700;line-height:1.6;font-feature-settings:normal}.contact .web{display:block;font-size:15px}.contact .qr{height:84px;width:84px;background:white;border:4px solid white;border-radius:4px}.back .footer{background:white;color:#486078;border-top:1px solid #e0e8ef}.back .footer .provider{margin-left:0}.back .footer .url{margin-left:auto}.back .footer .number{margin-left:24px}
'''

CSS += '''
.page{--accent:#147eb5;--light:#ecf8ff;--mid:#bfe1f6}.donation{--accent:#237ab5;--light:#eef9ff;--mid:#c2e3f5}
.page:not(.back) .header{z-index:2}.page:not(.back) .headline{top:181px;font-size:30px;line-height:1.4;z-index:2}.page:not(.back) .lead{top:231px;font-size:20px;line-height:1.5;z-index:2}
.scenery{position:absolute;right:0;top:0;width:470px;height:284px;overflow:hidden}.scenery img{width:100%;height:100%;object-fit:cover}.scenery:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#fff 0,#fffffff2 12%,#ffffff00 55%),linear-gradient(0deg,#fff 0,#ffffff00 48%)}
.screen-pair{position:absolute;left:107px;right:107px;top:302px;display:grid;grid-template-columns:400px 400px;justify-content:space-between}.screen-pair h2{font-size:21px;line-height:31px;border-radius:18px;background:linear-gradient(90deg,#e8f5ff,#f1faff);text-align:center;color:#1268a8;margin-bottom:12px}.screen-pair figure{height:468px;border:1px solid #d7e9f4;border-radius:13px;background:white;overflow:hidden;box-shadow:0 8px 23px #19699624}.screen-pair img{width:400px;height:auto}.capture-caption{position:absolute;top:822px;left:150px;right:150px;font-size:14px;line-height:20px;text-align:center;color:#4f6c85}
.features{top:854px;gap:15px 32px}.feature{min-height:106px;grid-template-columns:68px 1fr;gap:14px}.feature h3{font-size:23px;line-height:31px}.feature p{font-size:18.5px;line-height:27px;margin-top:7px}.feature-art{background:linear-gradient(145deg,#f5fbff,#d9effc);box-shadow:0 5px 12px #176baa14}
.proof{display:block;top:1084px;height:354px;padding:0;background:linear-gradient(110deg,#e1f3ff,#eaf8ff)}.proof .case-heading{position:absolute;left:31px;top:16px;border-left:8px solid #0873db;padding-left:20px;font-size:33px;line-height:52px;font-weight:800;white-space:nowrap}.case-columns{position:absolute;left:55px;top:85px;width:925px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.case-media{min-width:0;display:flex;flex-direction:column;align-items:center}.case-illustration{width:100%;border:1px solid white;border-radius:4px;overflow:hidden}.case-illustration img{width:100%;height:auto}.proof .media-source{margin-top:7px;font-size:15px;line-height:22px;font-weight:700;white-space:nowrap;text-align:center;color:#092345}.media-source span{display:block;font-size:14px;line-height:20px;font-weight:400}.case-profile{min-width:0;display:grid;grid-template-columns:140px 1fr;gap:7px 16px;align-content:start}.sato{width:140px;height:140px;border-radius:3px;overflow:hidden;box-shadow:0 2px 6px #19466414}.sato img{width:100%;height:auto}.profile-person{align-self:center}.proof .affiliation{font-size:18px;line-height:29px;white-space:nowrap;margin:0;color:#092345}.municipality{font-size:23px;font-weight:800}.proof .person-name{font-size:31px;line-height:48px;font-weight:800;margin-top:8px;color:#092345}.proof .advice{grid-column:1/-1;font-size:16.5px;line-height:24px;margin:0;color:#092345}.advice span{display:block}
.diagram{background:linear-gradient(130deg,#eef9ff,#e2f3ff);box-shadow:0 6px 20px #2674ad0b}.source-row{box-shadow:0 4px 10px #2674ad0c}.hub{background:linear-gradient(140deg,#fff,#f7fcff);box-shadow:0 8px 19px #2674ad19}.hub .hub-icon{padding:0;background:none}.hub .hub-icon svg{width:55px;height:55px;fill:initial;stroke:none;stroke-width:initial}.diagram .flow-arrow{color:#2f93d5}
'''


def feature(n, title, body):
    svg = (REFERENCE / f'feature-{n}.svg').read_text()
    return f'<section class="feature"><div class="feature-art">{svg}</div><div><h3>{title}</h3><p>{body}</p></div></section>'


def brand(audience, back=False):
    return f'<header class="header">' + ('' if back else f'<p class="audience">{audience}</p>') + f'<div class="brand">{image("brandIcon.png", alt="SwarrowChat")}<strong>SwarrowChat</strong>' + (f'<span class="edition">{audience}</span>' if back else '') + '</div></header>'


def footer(n, back=False):
    company = '<span class="provider">株式会社Vecta</span>'
    link = '<a class="url" href="https://swarrow.com/chat">swarrow.com/chat</a>'
    content = company + link if back else '<strong>SwarrowChat</strong>' + link + company
    return '<footer class="footer">' + content + f'<span class="number">{n} / 2</span></footer>'


def row(kind, text):
    return f'<div class="source-row">{icon(kind)}<span>{text}</span></div>'


def proof():
    return '<section class="proof"><h2 class="case-heading">導入事例 宮崎県都城市</h2><div class="case-columns"><div class="case-media"><figure class="case-illustration">' + image('../../assets/news-illustration.png', alt='キャスターがテキストチャットと音声会話のAI窓口を紹介するイラスト') + '<p class="media-source">NHK宮崎放送局「てげビビ！サタデー」で紹介<span>2026年10月17日放送（画像はイメージ）</span></p></figure></div><div class="case-profile"><figure class="sato">' + image('sato.webp', alt='佐藤泰格氏のプロフィール写真') + '</figure><div class="profile-person"><p class="affiliation"><span class="municipality">都城市</span><br>総合政策部 デジタル統括課 副課長</p><p class="person-name">佐藤 泰格 氏</p></div><p class="advice"><span>都城市のDXを推進し、自治体向け生成AIシステムの<br>開発や職員向け研修を手がけられているお立場から、</span><span>SwarrowChatのサービス改善や自治体での<br>AI導入・活用についてご助言をいただいています。</span></p></div></div></section>'


def front(audience, topic, heading, lead, screens, features):
    pairs = ''.join('<div><h2>' + label + '</h2><figure>' + image(ROOT / 'assets' / f'{slug}-r2.png', alt=f'{label}の専用AI実画面') + '</figure></div>' for slug, label in screens)
    return '<div class="scenery" aria-hidden="true">' + image(ROOT / 'assets' / f'{topic}-scenery-r2.png') + '</div>' + brand(audience) + f'<h1 class="headline">{heading}</h1><p class="lead">{lead}</p><section class="screen-pair">{pairs}</section><p class="capture-caption">専用AI定義と説明用のモデル情報を使用した実際の会話画面です</p><section class="features">{features}</section>' + proof() + footer(1)


def steps(items):
    return '<section class="steps"><h2>対象の情報と質問を確認して導入</h2><div class="step-grid">' + ''.join(f'<div class="step"><h3 class="step-label"><span>0{i}</span>{heading}</h3><p>{body}</p></div>' for i, (heading, body) in enumerate(items, 1)) + '</div></section>'


def contact():
    return '<section class="contact"><div class="contact-copy"><p>提供範囲と費用は対象業務・連携内容に応じてお見積もり</p><a class="mail" href="mailto:sales@vecta.co.jp">sales@vecta.co.jp</a><a class="web" href="https://swarrow.com/chat#contact">swarrow.com/chat#contact</a></div><a href="https://swarrow.com/chat#contact">' + image('contactQr.png', 'qr', 'お問い合わせフォームのQRコード') + '</a></section>'


TOURISM_FRONT = front(
    '観光協会・観光案内所向け', 'tourism',
    '地域の観光情報を多言語で案内するAI窓口',
    '観光サイトやFAQをもとに旅行者の質問に回答。<br>施設の詳細やアクセスなど、次に確認するページまで案内します。',
    [('tourism-ja', '観光スポットを相談'), ('tourism-en', '多言語での観光案内')],
    feature(1, '公式情報をまとめて活用', '観光協会・自治体・施設のページや<br>FAQを、対象を決めて回答に活用。')
    + feature(4, '多言語での案内に対応', '日本語の公開情報をもとに案内。<br>利用する言語を選んで確認できます。')
    + feature(3, '参照元ページへ案内', '根拠となるページや詳細情報を提示。<br>施設・予約サイトへの導線を支援。')
    + feature(2, '問い合わせを見て改善', '会話ログや回答内容を確認し、<br>案内情報と回答設定を見直します。'),
)

TOURISM_BACK = brand('観光協会向け', True) + '''
<h1 class="headline">既存の観光サイトにAI窓口を追加</h1>
<p class="lead">サイト全体を作り直さず、対象の公開情報と回答方針を整えて設置できます。<br>季節イベントや営業情報は、更新元と確認担当者を決めて運用します。</p>
<section class="diagram"><h2>情報を確認して案内ページへつなぐ仕組み</h2><div class="diagram-grid"><div class="source-stack">
''' + row('map', '観光協会・施設のHP') + row('page', '交通・イベントの案内') + row('chat', 'よくある質問・資料') + '''
</div><span class="flow-arrow">›</span><div class="hub"><div class="hub-icon">''' + (REFERENCE / 'feature-2.svg').read_text() + '''</div><strong>SwarrowChat</strong><p>質問に関連する情報を確認<br>根拠とともに回答</p></div><span class="flow-arrow">›</span><div class="outcomes">
''' + row('globe', '多言語での一次案内') + row('page', '施設詳細・アクセス') + row('chat', '担当窓口への案内') + '''
</div></div><p class="flow-note">図は提供構成の説明です。情報の取得範囲・更新方法・対応言語は導入時に確認します。</p></section>
<section class="split-note"><div><h2>公開情報の案内から開始</h2><p>施設情報、交通案内、季節イベント、<br>公式モデルコースなどを対象に設定。<br>分からない内容は確認先へ案内します。</p></div><div><h2>更新と問い合わせ対応を分担</h2><p>各情報の更新担当者と案内先を整理。<br>個別の予約や詳細な相談は、既存窓口や<br>施設の受付へつなぎます。</p></div></section>
''' + steps([('対象情報を整理', '観光サイト・FAQと、<br>案内する範囲を確認。'), ('質問で品質を確認', '旅行者の質問例と外国語で、<br>回答・参照元を確認。'), ('公開後も見直す', '質問ログと情報の更新を確認。<br>不足する案内を追加。')]) + '''
<section class="scope"><h2>空き状況の照会・予約確定は個別連携</h2><p>宿泊・体験の在庫、リアルタイムの運行情報、地図上の周遊ルートなどは、<br>連携先のデータ・API・運用条件を確認して別途設計します。<strong>音声会話はオプションです。</strong></p></section>
''' + contact() + footer(2, True)

DONATION_FRONT = front(
    'ふるさと納税担当課・運営事業者向け', 'donation',
    '返礼品選びと寄附の手続きを支えるAI窓口',
    '返礼品や手続きの公開情報をもとに、寄附前後の質問に回答。<br>個別の確認が必要な問い合わせは担当窓口へ案内します。',
    [('donation-gifts', '返礼品選びを相談'), ('donation-onestop', '申請の手順を確認')],
    feature(1, '既存の案内を活用', '自治体・特設サイトのページや<br>FAQを、対象を決めて回答に活用。')
    + feature(2, '参照元と窓口を提示', '案内の根拠となるページを表示。<br>確認が必要な内容は担当窓口へ。')
    + feature(3, '寄附前後の質問に対応', '返礼品の説明や申込先、申請方法、<br>書類の問い合わせ先を案内します。')
    + feature(4, '多言語・音声にも対応', '多言語での案内に対応。<br>音声会話はオプションで利用可能。'),
)

DONATION_BACK = brand('ふるさと納税向け', True) + '''
<h1 class="headline">ページの更新とAI窓口を組み合わせる</h1>
<p class="lead">SwarrowSiteで地域の紹介や返礼品の特集、手続き案内を編集。<br>承認した情報をホームページに掲載し、SwarrowChatの回答にも活用します。</p>
<section class="diagram"><h2>SwarrowSiteとの組み合わせ案</h2><div class="diagram-grid site"><div class="source-stack">
''' + row('gift', '地域・返礼品の紹介') + row('page', '手続き・FAQの原稿') + row('check', '担当者が内容を確認') + '''
</div><span class="flow-arrow">›</span><div class="hub"><div class="hub-icon">''' + (REFERENCE / 'feature-1.svg').read_text() + '''</div><strong>SwarrowSite</strong><p>ページを作成・編集<br>承認した情報を公開</p></div><span class="flow-arrow">›</span><div class="outcomes">
''' + row('page', '特設サイトに掲載') + row('chat', 'SwarrowChatに反映') + row('gift', '既存の寄附申込先へ') + '''
</div></div><p class="flow-note">SwarrowSiteの編集・承認・AI反映基盤を使う構成案です。<br>一般公開に必要な設定と運用は、対象サイトに合わせて別途整備します。</p></section>
<section class="split-note"><div><h2>担当者自身でページを更新</h2><p>地域の魅力、寄附金の使い道、返礼品の<br>紹介、手続き・FAQを追加・編集。<br>内容を確認してから公開できます。</p></div><div><h2>既存の寄附申込先へつなぐ</h2><p>特設ページとAI窓口から、既存の<br>寄附ポータルや手続きページへ案内。<br>決済や申請の基盤を活かします。</p></div></section>
''' + steps([('対象業務を選ぶ', '寄附前・寄附後のFAQと、<br>案内する窓口を確認。'), ('情報と回答を確認', '公開情報と質問例を使い、<br>回答・参照元を確認。'), ('更新体制を整える', '担当者と確認手順を決め、<br>年末などの更新に対応。')]) + '''
<section class="scope"><h2>本人の配送・申請状況の照会は個別連携</h2><p>住所変更、在庫・配送状況、寄附の決済、本人の申請受付状況の確認には、<br>外部システムと本人確認の連携が必要です。<strong>個人別の控除額の判定は対象外です。</strong></p></section>
''' + contact() + footer(2, True)


def build():
    for font in ['NotoSansJP-Regular.ttf', 'NotoSansJP-Bold.ttf']:
        assert (FONTS / font).is_file(), f'Noto Sans JP required: {FONTS / font}'
    css = CSS.replace('FONT_REGULAR', (FONTS / 'NotoSansJP-Regular.ttf').as_uri()).replace('FONT_BOLD', (FONTS / 'NotoSansJP-Bold.ttf').as_uri())
    for slug, title, front, back in [
        ('tourism', '観光協会向け', TOURISM_FRONT, TOURISM_BACK),
        ('donation', 'ふるさと納税向け', DONATION_FRONT, DONATION_BACK),
    ]:
        html = f'<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>SwarrowChat {title}</title><style>{css}</style></head><body><main class="page {slug}">{front}</main><main class="page back {slug}">{back}</main></body></html>'
        assert 'Swarrow Chat' not in html and 'Swarrow Call' not in html
        (BUILD / f'{slug}.html').write_text(html)
    print(json.dumps({'brochures': 2, 'pages_each': 2, 'font': 'Noto Sans JP'}, ensure_ascii=False))


if __name__ == '__main__':
    build()
