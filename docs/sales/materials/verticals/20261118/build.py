"""Build the two A4 duplex brochures using approved Swarrow artwork and real UI."""

import ast
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
.back .headline{top:115px;font-size:35px}.back .lead{top:176px;font-size:21px}
.usage-scene{position:absolute;left:40px;right:40px;top:253px;border:1px solid #cde3f1;border-radius:16px;overflow:hidden;background:#f2f9ff;box-shadow:0 10px 24px #2674ad18}.browser-chrome{height:28px;background:linear-gradient(100deg,#c7e2f5,#e4f2fb);display:flex;align-items:center;gap:6px;padding:0 14px}.browser-chrome i{width:7px;height:7px;border-radius:50%;background:white}.site-bar{height:52px;padding:0 20px;background:white;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dfebf2}.site-name{display:flex;align-items:center;gap:10px;font-size:20px}.site-name svg{width:25px;height:25px;fill:none;stroke:#1686bc;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.site-nav{display:flex;gap:22px;font-size:14px;color:#49667a}.usage-content{display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:24px;padding:16px}.site-hero{position:relative;height:205px;border-radius:10px;overflow:hidden;background:#fff}.site-hero>img{position:absolute;right:0;top:0;width:78%;height:100%;object-fit:cover}.site-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#fff 3%,#ffffffed 30%,#ffffff00 75%)}.site-copy{position:relative;z-index:1;padding:26px 19px}.site-copy .site-kicker{font-size:14px;line-height:22px;color:#187fad;font-weight:700;margin-bottom:8px}.site-copy h2{font-size:29px;line-height:41px;letter-spacing:-.7px}.site-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.site-card{height:126px;padding:12px 10px;background:white;border:1px solid #dceaf2;border-radius:9px}.site-card svg{height:29px;width:29px;fill:none;stroke:#258bbf;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round;margin-bottom:7px}.site-card h3{font-size:16px;line-height:24px}.site-card p{font-size:13.5px;line-height:21px;color:#49667a;margin-top:3px}.site-path{display:flex;align-items:center;gap:10px;justify-content:center;margin-top:15px;min-height:47px;border-radius:8px;background:#e0f1fc;font-size:15px;font-weight:700;color:#1b709f}.site-path b{color:#64a9d2;font-size:23px}.embedded-chat{width:350px;height:410px;overflow:hidden;border-radius:12px;border:1px solid #d0e3ef;box-shadow:0 7px 17px #2674ad24;background:white}.embedded-chat img{width:100%;height:auto}.usage-caption{position:absolute;left:50px;right:50px;top:789px;font-size:15.5px;line-height:22px;color:#4e687c}

'''

CSS += '''
.page{--accent:#147eb5;--light:#ecf8ff;--mid:#bfe1f6}.donation{--accent:#237ab5;--light:#eef9ff;--mid:#c2e3f5}
.page:not(.back) .header{z-index:2}.page:not(.back) .headline{top:181px;font-size:30px;line-height:1.4;z-index:2}.page:not(.back) .lead{top:231px;font-size:20px;line-height:1.5;z-index:2}
.scenery{position:absolute;right:0;top:0;width:470px;height:284px;overflow:hidden}.scenery img{width:100%;height:100%;object-fit:cover}.scenery:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#fff 0,#fffffff2 12%,#ffffff00 55%),linear-gradient(0deg,#fff 0,#ffffff00 48%)}
.front-scene{position:absolute;left:40px;right:40px;top:326px}.screen-pair{display:grid;grid-template-columns:400px 400px;justify-content:space-between;padding:8px 40px}.screen-pair h2{font-size:23px;line-height:32px;text-align:center;color:#1268a8;margin-bottom:9px}.screen-pair figure{position:relative;width:370px;height:432px;margin:auto;border:1px solid #d7e9f4;border-radius:13px;background:white;overflow:hidden;box-shadow:0 8px 23px #19699624}.screen-pair img{width:370px;height:auto}.screen-pair .voice-preview{background:#f7fafc;display:flex;align-items:center}

.features{top:872px;gap:15px 32px}.feature{min-height:92px;grid-template-columns:68px 1fr;gap:14px}.feature h3{font-size:23px;line-height:31px}.feature p{font-size:18.5px;line-height:27px;margin-top:7px}.feature-art{background:linear-gradient(145deg,#f5fbff,#d9effc);box-shadow:0 5px 12px #176baa14}
.proof{display:block;top:1084px;height:354px;padding:0;background:linear-gradient(110deg,#e1f3ff,#eaf8ff)}.proof .case-heading{position:absolute;left:31px;top:16px;border-left:8px solid #0873db;padding-left:20px;font-size:33px;line-height:52px;font-weight:800;white-space:nowrap}.case-columns{position:absolute;left:55px;top:85px;width:925px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.case-media{min-width:0;display:flex;flex-direction:column;align-items:center}.case-illustration{width:100%;border:1px solid white;border-radius:4px;overflow:hidden}.case-illustration img{width:100%;height:auto}.proof .media-source{margin-top:7px;font-size:15px;line-height:22px;font-weight:700;white-space:nowrap;text-align:center;color:#092345}.media-source span{display:block;font-size:14px;line-height:20px;font-weight:400}.case-profile{min-width:0;display:grid;grid-template-columns:140px 1fr;gap:7px 16px;align-content:start}.sato{width:140px;height:140px;border-radius:3px;overflow:hidden;box-shadow:0 2px 6px #19466414}.sato img{width:100%;height:auto}.profile-person{align-self:center}.proof .affiliation{font-size:18px;line-height:29px;white-space:nowrap;margin:0;color:#092345}.municipality{font-size:23px;font-weight:800}.proof .person-name{font-size:31px;line-height:48px;font-weight:800;margin-top:8px;color:#092345}.proof .advice{grid-column:1/-1;font-size:16.5px;line-height:24px;margin:0;color:#092345}.advice span{display:block}

'''


COMMON_SOURCE = REFERENCE.parent / 'build-brochure.py'
common_tree = ast.parse(COMMON_SOURCE.read_text())
COMMON_CSS = ast.literal_eval(next(node.value for node in common_tree.body if isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == 'CSS' for target in node.targets)))
CSS += COMMON_CSS[COMMON_CSS.index('@font-face'):COMMON_CSS.index('@page')]
CSS += COMMON_CSS[COMMON_CSS.index('.p2-top-wash{'):COMMON_CSS.index('.p2-top-wash{')+COMMON_CSS[COMMON_CSS.index('.p2-top-wash{'):].index('}')+1]
CSS += '.back{isolation:isolate}.sales-guide{position:absolute;inset:0;font-family:BrochureSans,sans-serif;font-weight:400}.sales-guide h2,.sales-guide h3{font-weight:800}'
CSS += COMMON_CSS[COMMON_CSS.index('.support-grid{'):COMMON_CSS.index(".p2 .page-foot{top:1440px;bottom:auto}")]
CSS += COMMON_CSS[COMMON_CSS.index('.page-foot{'):COMMON_CSS.index('.cover-category{')]
CSS += '.sales-guide .page-foot{top:1440px;bottom:auto}.sales-guide .page-foot .site{font-size:16px;color:#3f5c76}.support-icon img{width:59px;height:59px}.flow-icon img{width:100%;height:100%}.offer-icon img{width:55px;height:55px}.offer-range{font-size:28px;line-height:1}.guide-scope{position:absolute;left:32px;top:1287px;width:991px;font-size:13px;line-height:17px;color:#52677d}.guide-scope p{margin:0}'
CSS += '''
.back .usage-scene{left:32px;right:32px;top:253px;height:369px}.back .browser-chrome{height:22px}.back .site-bar{height:38px;padding:0 12px;max-width:660px}.back .site-name{font-size:17px;gap:8px}.back .site-name svg{width:22px;height:22px}.back .site-nav{gap:16px;font-size:13px}.back .usage-content{display:block;width:660px;padding:12px}.back .site-hero{height:125px}.back .site-copy{padding:12px 16px}.back .site-copy .site-kicker{font-size:13px;line-height:20px;margin-bottom:6px}.back .site-copy h2{font-size:25px;line-height:34px}.back .site-cards{margin-top:12px}.back .site-card{height:105px;padding:6px 9px}.back .site-card svg{width:22px;height:22px;margin-bottom:4px}.back .site-card h3{font-size:15px;line-height:22px}.back .site-card p{font-size:13px;line-height:19px;margin-top:3px}.back .site-path{height:30px;min-height:30px;margin-top:10px;font-size:14px}.back .embedded-chat{position:absolute;right:15px;top:9px;width:300px;height:350px}.back .usage-caption{left:32px;right:32px;top:633px;font-size:14px;line-height:19px}
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


def proof():
    return '<section class="proof"><h2 class="case-heading">導入事例 宮崎県都城市</h2><div class="case-columns"><div class="case-media"><figure class="case-illustration">' + image('../../assets/news-illustration.png', alt='キャスターがテキストチャットと音声会話のAI窓口を紹介するイラスト') + '<p class="media-source">NHK宮崎放送局「てげビビ！サタデー」で紹介<span>2026年10月17日放送（画像はイメージ）</span></p></figure></div><div class="case-profile"><figure class="sato">' + image('sato.webp', alt='佐藤泰格氏のプロフィール写真') + '</figure><div class="profile-person"><p class="affiliation"><span class="municipality">都城市</span><br>総合政策部 デジタル統括課 副課長</p><p class="person-name">佐藤 泰格 氏</p></div><p class="advice"><span>都城市のDXを推進し、自治体向け生成AIシステムの<br>開発や職員向け研修を手がけられているお立場から、</span><span>SwarrowChatのサービス改善や自治体での<br>AI導入・活用についてご助言をいただいています。</span></p></div></div></section>'


def front(audience, topic, heading, lead, capture, features):
    text = '<div><h2>テキスト</h2><figure class="text-preview">' + image(ROOT / 'assets' / f'{capture}-r2.png', alt='専用AIの実際のテキスト会話画面') + '</figure></div>'
    voice = '<div><h2>音声会話</h2><figure class="voice-preview">' + image('avatar.png', alt='アバターが音声で回答中の既存製品画面') + '</figure></div>'
    scene = '<section class="front-scene" aria-label="テキストと音声会話の製品画面"><div class="screen-pair">' + text + voice + '</div></section>'
    return '<div class="scenery" aria-hidden="true">' + image(ROOT / 'assets' / f'{topic}-scenery-r2.png') + '</div>' + brand(audience) + f'<h1 class="headline">{heading}</h1><p class="lead">{lead}</p>' + scene + '<section class="features">' + features + '</section>' + proof() + footer(1)


def usage(topic, title, heading, cards, capture, path):
    card_html = ''.join(f'<div class="site-card">{icon(kind)}<h3>{label}</h3><p>{body}</p></div>' for kind, label, body in cards)
    return '<section class="usage-scene" aria-label="WebページとAIの利用イメージ"><div class="browser-chrome"><i></i><i></i><i></i></div><div class="site-bar"><div class="site-name">' + icon('map' if topic == 'tourism' else 'gift') + f'<strong>{title}</strong></div><div class="site-nav">' + ''.join(f'<span>{label}</span>' for _, label, _ in cards) + '</div></div><div class="usage-content"><div><div class="site-hero">' + image(ROOT / 'assets' / f'{topic}-scenery-r2.png') + f'<div class="site-copy"><p class="site-kicker">{title}</p><h2>{heading}</h2></div></div><div class="site-cards">{card_html}</div><div class="site-path">' + '<b>›</b>'.join(f'<span>{label}</span>' for label in path) + '</div></div><figure class="embedded-chat">' + image(ROOT / 'assets' / f'{capture}-r2.png', alt='専用AIの実際の会話画面') + '</figure></div></section>'


def guide_icon(kind, tone='blue'):
    return image(ROOT / 'assets' / f'guide-{kind}-{tone}.svg')


def support(kind, title, body):
    return '<div class="support-card"><div class="support-icon">' + guide_icon(kind, 'green') + f'</div><h3>{title}</h3><p>{body}</p></div>'


def steps():
    items = [('対象確認', '対象サイトと<br>設置環境を確認', 'search'), ('初期設定', '弊社がデータ<br>取得・設定', 'gear'), ('無料評価', '対象の情報で<br>回答を確認', 'check'), ('ご契約・公開', '導入範囲を決めて<br>運用開始', 'megaphone')]
    arrow = '<svg class="flow-arrow" viewBox="0 0 40 48" aria-hidden="true"><path d="M0 12h18V0l22 24-22 24V36H0Z"/></svg>'
    cards = ''.join(f'<section class="flow-card"><span class="flow-number">0{i}</span><div class="flow-icon">' + guide_icon(kind) + f'</div><h3>{heading}</h3><p>{body}</p>' + (arrow if i < 4 else '') + '</section>' for i, (heading, body, kind) in enumerate(items, 1))
    return '<h2 class="flow-heading">無料評価から導入まで</h2><section class="flow-grid">' + cards + '</section>'


def contact():
    return '<section class="contact-band"><div class="contact-mail"><h2>メールでのお問い合わせ</h2><a href="mailto:sales@vecta.co.jp"><svg viewBox="0 0 36 30" aria-hidden="true"><path d="M3 5h30v21H3Z" fill="white"/><path d="m3 5 15 12L33 5" fill="none" stroke="#12385f" stroke-width="2.5" stroke-linejoin="round"/></svg>sales@vecta.co.jp</a></div><a class="contact-form-copy" href="https://swarrow.com/chat#contact"><h2>お問い合わせフォーム</h2><span>swarrow.com/chat#contact</span></a><a class="contact-qr" href="https://swarrow.com/chat#contact">' + image('contactQr.png', alt='お問い合わせフォームのQRコード') + '</a></section><footer class="page-foot"><span class="provider">サービス提供：株式会社Vecta</span><a class="site" href="https://swarrow.com/chat">swarrow.com/chat</a><span class="page-number">2 / 2</span></footer>'


def sales_guide(scope):
    trial = '<div class="offer-card trial-card"><div class="offer-icon">' + guide_icon('calendar') + '</div><h2 class="offer-head"><span>無料評価は</span><span class="offer-amount"><span class="offer-number">1</span><span class="offer-unit">か月</span></span><span>程度</span></h2><p class="offer-detail">期間の延長もご相談いただけます。</p></div>'
    price = '<div class="offer-card pricing-card"><div class="offer-icon">' + guide_icon('document', 'green') + '</div><h2 class="offer-head"><span>月額</span><span class="offer-amount"><span class="offer-number">5</span><span class="offer-unit">万円</span><span class="offer-range">〜</span></span><span class="offer-tax">（税別）</span></h2><p class="initial-fee">初期費用10万円〜<span class="tax">（税別）</span></p><p class="offer-note"><span>※ 料金目安です</span><span>※ 音声会話は別途料金です</span></p></div>'
    return '<div class="sales-guide"><section class="support-grid">' + support('gear', '初期設定は弊社が対応', '対象のホームページ・資料を確認し、<br>データ取得と回答設定を行います。') + support('swap', '既存チャットボットからも切り替え', '設置方法と現在の契約条件を確認し、<br>切り替えまで支援します。') + '</section>' + steps() + '<section class="offers">' + trial + price + '</section><section class="guide-scope"><p>※ 想定問い合わせ量・対象情報・連携内容に応じてお見積もりします。</p><p>' + scope + '</p></section>' + contact() + '</div>'


TOURISM_FRONT = front(
    '観光協会・観光案内所向け', 'tourism',
    '地域の観光情報を多言語で案内するAI窓口',
    '観光サイトやFAQをもとに旅行者の質問に回答。<br>施設の詳細やアクセスなど、次に確認するページまで案内します。',
    'tourism-ja',
    feature(1, '公式情報をまとめて活用', '観光協会・自治体・施設のページや<br>FAQを、対象を決めて回答に活用。')
    + feature(4, '多言語での案内に対応', '日本語の公開情報をもとに案内。<br>利用する言語を選んで確認できます。')
    + feature(3, '参照元ページへ案内', '根拠となるページや詳細情報を提示。<br>施設・予約サイトへの導線を支援。')
    + feature(2, '問い合わせを見て改善', '会話ログや回答内容を確認し、<br>案内情報と回答設定を見直します。'),
)

TOURISM_BACK = '<div class="p2-top-wash"></div>' + brand('観光協会向け', True) + '''
<h1 class="headline">既存の観光サイトにAI窓口を追加</h1>
<p class="lead">サイト全体を作り直さず、対象の公開情報と回答方針を整えて設置できます。<br>季節イベントや営業情報は、更新元と確認担当者を決めて運用します。</p>
''' + usage('tourism', '観光案内サイト', '雨の日も楽しめる<br>家族の観光案内', [('map', '観光スポット', '屋内施設や体験を<br>希望に合わせて探す'), ('page', 'アクセス', '駅からの行き方や<br>交通案内を確認'), ('chat', '観光案内所', '詳しい相談は<br>担当窓口へ')], 'tourism-ja', ['観光情報を見る', 'AIに相談', '詳細を確認']) + '''
<p class="usage-caption">背景のWebページは導入イメージ、チャット部分は専用AIの実画面です。<br>情報の取得範囲・更新方法・対応言語は導入時に確認します。</p>
''' + sales_guide('※ 空き状況・予約確定・運行情報などは個別連携です。')


DONATION_FRONT = front(
    'ふるさと納税担当課・運営事業者向け', 'donation',
    '返礼品選びと寄附の手続きを支えるAI窓口',
    '返礼品や手続きの公開情報をもとに、寄附前後の質問に回答。<br>個別の確認が必要な問い合わせは担当窓口へ案内します。',
    'donation-gifts',
    feature(1, '既存の案内を活用', '自治体・特設サイトのページや<br>FAQを、対象を決めて回答に活用。')
    + feature(2, '参照元と窓口を提示', '案内の根拠となるページを表示。<br>確認が必要な内容は担当窓口へ。')
    + feature(3, '寄附前後の質問に対応', '返礼品の説明や申込先、申請方法、<br>書類の問い合わせ先を案内します。')
    + feature(4, '多言語・音声にも対応', '多言語での案内に対応。<br>音声会話はオプションで利用可能。'),
)

DONATION_BACK = '<div class="p2-top-wash"></div>' + brand('ふるさと納税向け', True) + '''
<h1 class="headline">ふるさと納税サイトにAI窓口を追加</h1>
<p class="lead">返礼品の特集ページやFAQをもとに、寄附前後の質問に回答。<br>既存の寄附申込先や手続きページへ案内します。</p>
''' + usage('donation', 'ふるさと納税特集', '地域の魅力を<br>返礼品から見つける', [('gift', '返礼品', 'お米や果物など<br>気になる品目を探す'), ('page', '手続き・FAQ', '寄附前後の疑問や<br>申請方法を確認'), ('check', '寄附金の使い道', '地域の取り組みや<br>寄附の活用を紹介')], 'donation-gifts', ['特集ページを見る', 'AIに相談', '既存の申込先へ']) + '''
<p class="usage-caption">背景のWebページは導入イメージ、チャット部分は専用AIの実画面です。<br>対象の公開情報と回答方針を確認して、既存サイトへAI窓口を設置します。</p>
''' + sales_guide('※ 配送・申請状況の照会や住所変更・決済は個別連携。個人別の控除額判定は対象外です。')


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
