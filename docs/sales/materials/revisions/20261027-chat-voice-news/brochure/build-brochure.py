from pathlib import Path
import json
import math

ROOT = Path(__file__).resolve().parent
ASSETS = json.loads((ROOT / 'asset-manifest.json').read_text())


def image(name, cls='', alt=''):
    return f'<img class="{cls}" data-source="{name}" src="{ASSETS[name]["path"]}" alt="{alt}">'


def icon(kind, tone='blue', uid=''):
    uid = uid or kind
    color, dark, light = ('#348acf', '#155b9d', '#dcedfb') if tone == 'blue' else ('#55a16a', '#307547', '#ddf1e2')
    defs = f'<defs><linearGradient id="{uid}-ink" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{color}"/><stop offset="1" stop-color="{dark}"/></linearGradient></defs>'
    ink = f'url(#{uid}-ink)'
    if kind == 'gear':
        points = []
        for i in range(48):
            r = 34 if i % 4 in (1, 2) else 27
            a = i * math.pi / 24
            points.append(f'{50+r*math.cos(a):.2f},{50+r*math.sin(a):.2f}')
        shape = f'<polygon points="{" ".join(points)}" fill="{ink}" stroke="{ink}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="50" r="12" fill="white"/>'
    elif kind == 'swap':
        shape = f'<path d="M24 43a28 28 0 0 1 47-15M76 57a28 28 0 0 1-47 15" fill="none" stroke="{ink}" stroke-width="9" stroke-linecap="round"/><path d="m71 14 1 22-22-1M29 86l-1-22 22 1" fill="none" stroke="{ink}" stroke-width="8" stroke-linejoin="round"/>'
    elif kind in ('document', 'search', 'check'):
        shape = f'<path d="M26 15h35l13 13v57H26a5 5 0 0 1-5-5V20a5 5 0 0 1 5-5Z" fill="white" stroke="{ink}" stroke-width="5" stroke-linejoin="round"/><path d="M61 15v14h13M33 41h28M33 52h25M33 63h17" fill="none" stroke="{ink}" stroke-width="4.5" stroke-linecap="round"/>'
        if kind == 'search':
            shape += f'<circle cx="65" cy="66" r="15" fill="white" stroke="{ink}" stroke-width="6"/><path d="m77 78 13 13" stroke="{dark}" stroke-width="7" stroke-linecap="round"/>'
        if kind == 'check':
            shape += f'<circle cx="71" cy="73" r="20" fill="{ink}" stroke="white" stroke-width="3"/><path d="m61 73 7 7 13-15" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    elif kind == 'calendar':
        shape = f'<rect x="21" y="25" width="58" height="57" rx="6" fill="white" stroke="{ink}" stroke-width="6"/><path d="M21 42h58M35 18v16M65 18v16" stroke="{ink}" stroke-width="6" stroke-linecap="round"/>'
        shape += ''.join(f'<rect x="{x}" y="{y}" width="7" height="7" rx="1.5" fill="{dark}"/>' for y in (51, 64) for x in (31, 46, 61))
    elif kind == 'megaphone':
        shape = f'<path d="M20 40h28l28-17v55L48 61H20Z" fill="{ink}" stroke="{ink}" stroke-width="4" stroke-linejoin="round"/><path d="m26 63 5 22h14l-5-22" fill="{dark}"/><path d="M83 38q12 12 0 24" fill="none" stroke="{color}" stroke-width="5" stroke-linecap="round"/><path d="M48 40v21" stroke="#9ac9eb" stroke-width="3"/>'
    else:
        shape = f'<circle cx="50" cy="50" r="30" fill="{ink}"/>'
    return f'<svg viewBox="0 0 100 100" aria-hidden="true">{defs}{shape}</svg>'


CSS = '''
@font-face{font-family:BrochureSans;src:local("HiraginoSans-W4");font-weight:400;font-style:normal}
@font-face{font-family:BrochureSans;src:local("HiraginoSans-W6");font-weight:600;font-style:normal}
@font-face{font-family:BrochureSans;src:local("HiraginoSans-W8");font-weight:800;font-style:normal}
@page{size:A4;margin:0}
*{box-sizing:border-box}html,body{margin:0;padding:0;width:1055px;height:1491px;background:#fff}
body{font-family:BrochureSans,sans-serif;color:#092345;font-weight:400;font-feature-settings:"palt" 1;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:1055px;height:1491px;overflow:hidden;isolation:isolate}
h1,h2,h3,p,figure{margin:0}h1,h2,h3{font-weight:800}img{display:block}a{color:inherit;text-decoration:none}
.brand{display:flex;align-items:center;gap:18px;position:absolute;left:36px;top:24px;height:87px}
.brand img{width:86px;height:86px;object-fit:contain}.wordmark{font-size:49px;font-weight:800;letter-spacing:-1.8px;line-height:1.15;font-feature-settings:normal}
.page-foot{position:absolute;left:0;bottom:0;width:1055px;height:51px;display:flex;align-items:center;padding:0 34px;font-size:16px;line-height:24px}
.page-foot .page-number{margin-left:auto;letter-spacing:1px;font-feature-settings:normal}.page-foot .provider{font-weight:600}.page-foot .site{margin-left:auto;margin-right:22px}
.cover-category{position:absolute;left:49px;top:31px;font-size:30px;line-height:42px;font-weight:800;letter-spacing:.1px;white-space:nowrap}
.p1 .brand{left:49px;top:85px;gap:19px;height:90px}.p1 .brand img{width:88px;height:88px}.p1 .wordmark{font-size:67px;letter-spacing:-2.5px}
.scenery{position:absolute;z-index:-1;pointer-events:none;left:606px;top:0;width:449px;height:278px;overflow:hidden}
.scenery:after{content:"";position:absolute;inset:0;background:linear-gradient(to right,#fff 0,#ffffff00 105px),linear-gradient(to bottom,#ffffff00 0,#ffffff00 216px,#fff 278px)}
.scenery img{width:100%;height:100%;object-fit:cover;object-position:50% 62%;opacity:.94}
.intro{position:absolute;left:49px;top:201px;font-size:24px;line-height:34px;font-weight:600;white-space:nowrap}
.screen-label{position:absolute;top:280px;width:340px;height:30px;border-radius:15px;background:#edf6ff;color:#1766a9;font-size:21px;line-height:30px;text-align:center;font-weight:600}
.chat-label{left:150px}.avatar-label{left:565px}
.screen{position:absolute;top:318px;width:340px;height:373px;border-radius:14px;background:#f7fafc;overflow:hidden;box-shadow:0 6px 20px #1969961c}
.screen img{width:100%;height:auto}.chat{left:150px}.avatar{left:565px}
.feature-divider{position:absolute;left:49px;top:716px;width:957px;height:1px;background:#d7e4ee}
.features{position:absolute;left:49px;top:744px;width:957px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:142px 142px;gap:18px 28px}
.feature{display:grid;grid-template-columns:88px 1fr;gap:16px;align-items:start}.feature-icon{width:88px;height:88px;margin-top:2px;border:1px solid #e0edf6;border-radius:23px;background:linear-gradient(145deg,#f5fbff,#e9f4fc);box-shadow:inset 0 1px 0 white,0 4px 12px #1258920f}
.feature-icon svg{display:block;width:86px;height:86px}.feature h3{font-size:26px;line-height:35px;white-space:nowrap;letter-spacing:-.2px}.feature p{font-size:21px;line-height:29px;margin-top:8px;white-space:nowrap}
.case-band{position:absolute;left:0;top:1084px;width:1055px;height:354px;background:linear-gradient(110deg,#e1f3ff,#eaf8ff)}
.case-heading{position:absolute;left:31px;top:1100px;border-left:8px solid #0873db;padding-left:20px;font-size:35px;line-height:44px;font-weight:800;white-space:nowrap}
.case-columns{position:absolute;left:55px;top:1169px;width:925px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
.case-media{min-width:0;display:flex;flex-direction:column;align-items:center}.case-illustration{width:100%;border:1px solid white;border-radius:4px;overflow:hidden}.case-illustration img{width:100%;height:auto}.media-source{margin-top:7px;font-size:16px;line-height:22px;font-weight:600;white-space:nowrap;text-align:center}.media-source span{display:block;font-size:14px;line-height:20px;font-weight:400}
.case-profile{min-width:0;display:grid;grid-template-columns:140px 1fr;gap:7px 16px;align-content:start}.sato{width:140px;height:140px;border-radius:3px;overflow:hidden;box-shadow:0 2px 6px #19466414}.sato img{width:100%;height:auto}.profile-person{align-self:center}.affiliation{font-size:19px;line-height:30px;white-space:nowrap}.municipality{font-size:24px;font-weight:800}.person-name{font-size:32px;line-height:50px;font-weight:800;margin-top:8px}.advice{grid-column:1/-1;font-size:17.5px;line-height:24px}.advice span{display:block;white-space:nowrap}
.p1 .page-foot{height:53px;background:linear-gradient(100deg,#093467,#104e7c);color:white;gap:12px}.foot-brand{display:flex;align-items:center;gap:8px;font-size:20px;font-weight:800;letter-spacing:-.5px;font-feature-settings:normal}.foot-brand img{width:30px;height:30px}.p1 .page-foot .site{padding-left:16px;border-left:1px solid #7b9bb8;margin-left:0;margin-right:0;font-size:18px}.p1 .page-foot .provider{margin-left:auto}.p1 .page-foot .page-number{margin-left:14px}
.p2-top-wash{position:absolute;inset:270px 0 auto;height:581px;background:linear-gradient(180deg,#f9fdff 0,#eef9ff 75%,#eaf6fc 100%);z-index:-1}
.install-title{position:absolute;left:31px;top:132px;width:993px;height:77px;display:flex;align-items:baseline;justify-content:center;gap:0;white-space:nowrap;font-size:58px;line-height:1.15;letter-spacing:-1.2px;font-weight:800}
.install-title .accent{font-size:76px;color:#126ac2;letter-spacing:-3px;padding:0 2px}
.install-subtitle{position:absolute;left:31px;top:223px;width:993px;text-align:center;color:#205e9c;font-size:32px;line-height:43px;font-weight:600;white-space:nowrap}
.installation{position:absolute;left:0;top:292px;width:1055px;height:369px}
.site-window{position:absolute;top:0;width:356px;height:301px;border:2px solid #d4e4f1;border-radius:15px;background:#f7fbff;box-shadow:0 5px 17px #12629b20;overflow:hidden}
.site-before{left:45px}.site-after{left:654px}.browser-bar{height:29px;background:linear-gradient(#a8c8e4,#9dbddc);display:flex;align-items:center;padding:0 13px;gap:7px}.browser-bar i{display:block;width:9px;height:9px;border-radius:50%;background:#e8f4ff}
.site-nav{height:49px;padding:0 13px;display:flex;align-items:center;justify-content:space-between;background:#fff;margin:10px 10px 0;border-radius:6px 6px 0 0;font-size:10.5px;font-weight:600;white-space:nowrap}.municipal-wordmark{display:flex;align-items:center;gap:5px;font-size:16px;font-weight:600;margin-right:9px}.municipal-wordmark i{width:16px;height:16px;border-radius:50%;background:#9dcded}
.site-photo{height:135px;margin:0 10px;overflow:hidden}.site-photo img{width:100%;height:100%;object-fit:cover;object-position:center 58%}
.site-tiles{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin:9px 10px 0}.site-tiles span{display:flex;flex-direction:column;justify-content:center;align-items:center;background:white;height:56px;border-radius:5px;font-size:11.5px;font-weight:600;gap:3px}.site-tiles svg{width:21px;height:21px;stroke:#4f90c4;stroke-width:2.3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.code-illustration{position:absolute;left:457px;top:49px;width:142px;height:210px}.code-disc{position:absolute;left:34px;top:0;width:75px;height:75px;border:4px solid #93beec;border-radius:50%;background:linear-gradient(145deg,#3d8bd1,#164b8d);color:white;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:600;z-index:1;font-feature-settings:normal}.code-window{position:absolute;top:54px;left:0;width:142px;height:150px;background:linear-gradient(140deg,#a7d8f6,#82bce9);padding:24px 13px 13px;border-radius:13px;box-shadow:0 6px 15px #2f82b323}.code-window:before{content:"";position:absolute;left:13px;top:15px;width:8px;height:8px;border-radius:50%;background:#d7efff;box-shadow:14px 0 #d7efff,28px 0 #d7efff}.code-window code{display:flex;align-items:center;justify-content:center;height:113px;border-radius:5px;background:#fff;color:#2869ab;font-size:20px;line-height:29px;font-weight:600;font-family:BrochureSans,sans-serif;font-feature-settings:normal;text-align:center}
.install-arrow{position:absolute;top:139px;width:40px;height:48px;fill:#419ce5}.install-arrow.left{left:410px}.install-arrow.right{left:606px}
.live-widget{position:absolute;left:817px;top:12px;width:193px;height:289.5px;overflow:hidden;border-radius:8px;background:#fff;box-shadow:0 3px 11px #154b7d33}.live-widget img{width:100%;height:auto}
.install-label{position:absolute;top:316px;height:45px;background:linear-gradient(130deg,#c3e0fc,#b8d9f7);border-radius:23px;display:flex;align-items:center;justify-content:center;font-size:25px;font-weight:800;white-space:nowrap}.install-label.before{left:91px;width:283px}.install-label.code{left:420px;width:215px}.install-label.after{left:699px;width:257px}
.support-grid{position:absolute;left:32px;top:683px;width:991px;display:grid;grid-template-columns:1fr 1fr;gap:27px}.support-card{height:151px;background:white;border:1px solid #e4eef6;border-radius:16px;box-shadow:0 3px 13px #4073a008;padding:25px 17px 18px 111px;position:relative}.support-icon{position:absolute;left:18px;top:28px;width:77px;height:77px;border-radius:50%;background:linear-gradient(130deg,#e6f7eb,#d2ecd9);padding:9px}.support-icon svg{width:59px;height:59px}.support-card h3{font-size:24px;line-height:33px;white-space:nowrap;letter-spacing:-.4px}.support-card p{margin-top:7px;font-size:20.5px;line-height:29px;white-space:nowrap}
.flow-heading{position:absolute;left:32px;top:866px;border-left:8px solid #0873db;padding-left:20px;font-size:34px;line-height:44px;font-weight:800}
.flow-grid{position:absolute;left:32px;top:925px;width:991px;display:grid;grid-template-columns:repeat(4,1fr);gap:36px}.flow-card{position:relative;height:191px;border:1.5px solid #e1ebf3;border-radius:15px;background:#fff;padding:85px 27px 16px}.flow-number{position:absolute;left:15px;top:14px;width:55px;height:55px;border-radius:50%;background:linear-gradient(135deg,#d0e8ff,#b7d9f7);display:flex;align-items:center;justify-content:center;font-size:27px;line-height:1;font-weight:800;letter-spacing:-.5px;font-feature-settings:normal}.flow-icon{position:absolute;left:110px;top:13px;width:66px;height:66px}.flow-icon svg{display:block;width:100%;height:100%}.flow-card h3{font-size:25px;line-height:34px;white-space:nowrap}.flow-card p{margin-top:6px;font-size:21px;line-height:28px;white-space:nowrap}.flow-arrow{position:absolute;right:-36px;top:83px;width:36px;height:40px;fill:#5aadeb}
.offers{position:absolute;left:32px;top:1135px;width:991px;display:grid;grid-template-columns:1fr 1fr;gap:20px}.offer-card{position:relative;height:150px;border-radius:18px;padding:8px 17px 10px 125px}.trial-card{background:linear-gradient(120deg,#e9f6ff,#e6f3fd)}.pricing-card{background:linear-gradient(120deg,#edf9f0,#e9f5ed)}.offer-icon{position:absolute;left:19px;top:30px;width:85px;height:85px;border-radius:50%;padding:15px;background:linear-gradient(135deg,#cfe7fe,#bcdafa)}.offer-icon svg{width:55px;height:55px}.pricing-card .offer-icon{background:linear-gradient(135deg,#ddf2e1,#cde8d5)}
.offer-head{display:flex;align-items:baseline;gap:4px;height:61px;white-space:nowrap;font-size:27px;font-weight:800;line-height:1;padding-top:6px;letter-spacing:-.6px}.offer-amount{display:inline-flex;align-items:baseline;gap:2px;color:#1468b9}.offer-number{font-size:58px;letter-spacing:-2px;line-height:1;font-feature-settings:normal}.offer-unit{font-size:40px;line-height:1;letter-spacing:-1.2px}.offer-tax{font-size:16px;letter-spacing:0;margin-left:5px;font-weight:600}.offer-detail{font-size:20px;line-height:28px;white-space:nowrap}.initial-fee{font-size:23px;font-weight:600;line-height:29px;letter-spacing:-.3px}.initial-fee .tax{font-size:16px;letter-spacing:0;margin-left:4px}.offer-note{margin-top:4px;font-size:14.5px;line-height:20px;color:#36556a;white-space:nowrap}.offer-note span{display:block;white-space:nowrap}
.contact-band{position:absolute;left:0;top:1323px;width:1055px;height:117px;background:#12385f;color:white}.contact-band h2{font-size:24px;line-height:31px;font-weight:600;white-space:nowrap}.contact-mail{position:absolute;left:40px;top:22px;width:487px;height:78px;border-right:1px solid #7290af}.contact-mail a{display:flex;align-items:center;gap:13px;width:max-content;margin-top:5px;font-size:30px;font-weight:800;line-height:36px;font-feature-settings:normal;letter-spacing:-.4px}.contact-mail svg{width:34px;height:30px;flex:none}.contact-form-copy{position:absolute;left:567px;top:22px;width:322px;height:74px}.contact-form-copy span{display:block;margin-top:6px;font-size:21px;line-height:30px;text-decoration:underline;text-underline-offset:4px;white-space:nowrap;font-feature-settings:normal;letter-spacing:-.2px}.contact-qr{position:absolute;left:909px;top:6px;width:105px;height:105px;border-radius:6px;background:#fff;overflow:hidden}.contact-qr img{width:105px;height:105px}.p2 .page-foot{top:1440px;bottom:auto}.p2 .page-foot .site{font-size:16px;color:#3f5c76}
'''


def page(body, number):
    return f'<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>SwarrowChat パンフレット</title><link rel="stylesheet" href="brochure.css"></head><body><main class="page p{number}">{body}</main></body></html>'


def brand():
    return f'<div class="brand">{image("brandIcon", alt="SwarrowChatの正式アイコン")}<span class="wordmark">SwarrowChat</span></div>'


features = [
    ('既存の情報をまとめて活用', '複数のホームページ・PDF・<br>独自Q&amp;Aに標準対応。既存の情報を<br>まとめて回答に活用します。'),
    ('回答品質を継続的に改善', '回答に参照元を表示。<br>正確さ・実用性・根拠の適切さを<br>レポートで定期評価・改善します。'),
    ('テキスト＆音声', '文字入力と音声会話に対応。<br>テキストのみ・音声のみでの利用も<br>選べます。'),
    ('多言語', '日本語の公式情報をもとに<br>多言語で案内し、外国人住民の<br>情報探しを支援します。'),
]
feature_html = ''.join(f'<section class="feature"><div class="feature-icon">{(ROOT / "assets" / f"feature-{i+1}.svg").read_text()}</div><div><h3>{heading}</h3><p>{body}</p></div></section>' for i, (heading, body) in enumerate(features))

p1 = f'''
<div class="scenery" aria-hidden="true">{image('scenery')}</div>
<p class="cover-category">自治体ホームページのAIチャットボット</p>{brand()}
<p class="intro">自治体のホームページや資料をもとに住民の質問に答え<br>必要な情報や手続きへ案内するAI窓口です</p>
<p class="screen-label chat-label">テキストチャット</p><p class="screen-label avatar-label">音声会話</p>
<figure class="screen chat">{image('chat', alt='実際のSwarrowChatの会話例')}</figure>
<figure class="screen avatar">{image('avatar', alt='実際の音声アバターの回答中の画面')}</figure>
<div class="feature-divider"></div><section class="features">{feature_html}</section>
<div class="case-band"></div><h2 class="case-heading">導入事例 宮崎県都城市</h2>
<div class="case-columns">
  <div class="case-media"><figure class="case-illustration">{image('newsIllustration', alt='キャスターがテキストチャットと音声会話のAI窓口を紹介するイラスト')}</figure><p class="media-source">NHK宮崎放送局「てげビビ！サタデー」で紹介<span>2026年10月17日放送（画像はイメージ）</span></p></div>
  <div class="case-profile"><figure class="sato">{image('sato', alt='佐藤泰格氏のプロフィール写真')}</figure><div class="profile-person"><p class="affiliation"><span class="municipality">都城市</span><br>総合政策部 デジタル統括課 副課長</p><p class="person-name">佐藤 泰格 氏</p></div><p class="advice"><span>都城市のDXを推進し、自治体向け生成AIシステムの<br>開発や職員向け研修を手がけられているお立場から、</span><span>SwarrowChatのサービス改善や自治体での<br>AI導入・活用についてご助言をいただいています。</span></p></div>
</div>
<footer class="page-foot"><span class="foot-brand">{image('brandIcon')}SwarrowChat</span><a class="site" href="https://swarrow.com/chat">swarrow.com/chat</a><span class="provider">提供：株式会社Vecta</span><span class="page-number">1 / 2</span></footer>
'''


def site_window(cls):
    document='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>'
    family='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21v-4a6 6 0 0 1 12 0v4M14 15a5 5 0 0 1 8 4v2"/></svg>'
    culture='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 8 10-6 10 6ZM4 21h16M6 9v9M12 9v9M18 9v9"/></svg>'
    return f'''<div class="site-window {cls}"><div class="browser-bar"><i></i><i></i><i></i></div><div class="site-nav"><span class="municipal-wordmark"><i></i>〇〇市</span><span>くらし</span><span>手続き</span><span>子育て</span><span>観光</span></div><div class="site-photo">{image('scenery')}</div><div class="site-tiles"><span>{document}くらしの手続き ›</span><span>{family}子育て・教育 ›</span><span>{culture}観光・文化 ›</span></div></div>'''


arrow = '<path d="M0 12h18V0l22 24-22 24V36H0Z"/>'
steps = [('対象確認', '対象サイトと<br>設置環境を確認', 'search'), ('初期設定', '弊社がデータ<br>取得・設定', 'gear'), ('無料評価', '自庁の情報で<br>回答を確認', 'check'), ('ご契約・公開', '導入範囲を決めて<br>運用開始', 'megaphone')]
step_html = ''
for i, (heading, body, kind) in enumerate(steps):
    step_html += f'<section class="flow-card"><span class="flow-number">0{i+1}</span><div class="flow-icon">{icon(kind, uid=f"step-{i+1}")}</div><h3>{heading}</h3><p>{body}</p>'
    if i < 3:
        step_html += f'<svg class="flow-arrow" viewBox="0 0 40 48" aria-hidden="true">{arrow}</svg>'
    step_html += '</section>'

p2 = f'''
<div class="p2-top-wash"></div>{brand()}
<h1 class="install-title">ホームページにコード<span class="accent">1行</span>で設置</h1>
<p class="install-subtitle">データ取得と初期設定は弊社が担当します</p>
<section class="installation" aria-label="設置のイメージ">
{site_window('site-before')}{site_window('site-after')}
<svg class="install-arrow left" viewBox="0 0 40 48" aria-hidden="true">{arrow}</svg><svg class="install-arrow right" viewBox="0 0 40 48" aria-hidden="true">{arrow}</svg>
<div class="code-illustration"><div class="code-disc">&lt;/&gt;</div><div class="code-window"><code>&lt;script<br>src="..."<br>&gt;&lt;/script&gt;</code></div></div>
<figure class="live-widget">{image('compactChat', alt='実際のSwarrowChatの画面')}</figure>
<p class="install-label before">既存のホームページ</p><p class="install-label code">コードを追加</p><p class="install-label after">AI窓口を設置</p>
</section>
<section class="support-grid">
<div class="support-card"><div class="support-icon">{icon('gear', 'green', 'support-gear')}</div><h3>初期設定は弊社が対応</h3><p>対象のホームページ・資料を確認し、<br>データ取得と回答設定を行います。</p></div>
<div class="support-card"><div class="support-icon">{icon('swap', 'green', 'support-swap')}</div><h3>既存チャットボットからも切り替え</h3><p>設置方法と現在の契約条件を確認し、<br>切り替えまで支援します。</p></div>
</section>
<h2 class="flow-heading">無料評価から導入まで</h2><section class="flow-grid">{step_html}</section>
<section class="offers">
<div class="offer-card trial-card"><div class="offer-icon">{icon('calendar', uid='trial-calendar')}</div><h2 class="offer-head"><span>無料評価は</span><span class="offer-amount"><span class="offer-number">1</span><span class="offer-unit">か月</span></span><span>程度</span></h2><p class="offer-detail">期間の延長もご相談いただけます。</p></div>
<div class="offer-card pricing-card"><div class="offer-icon">{icon('document', 'green', 'pricing-document')}</div><h2 class="offer-head"><span>月額</span><span class="offer-amount"><span class="offer-number">5</span><span class="offer-unit">万円</span></span><span class="offer-tax">（税別）</span></h2><p class="initial-fee">初期費用10万円<span class="tax">（税別）</span></p><p class="offer-note"><span>※1 人口10万人以下の自治体向けの料金です</span><span>※2 音声会話オプションは別途料金です</span></p></div>
</section>
<section class="contact-band" aria-label="お問い合わせ先"><div class="contact-mail"><h2>メールでのお問い合わせ</h2><a href="mailto:sales@vecta.co.jp"><svg viewBox="0 0 36 30" aria-hidden="true"><path d="M3 5h30v21H3Z" fill="white"/><path d="m3 5 15 12L33 5" fill="none" stroke="#12385f" stroke-width="2.5" stroke-linejoin="round"/></svg>sales@vecta.co.jp</a></div><a class="contact-form-copy" href="https://swarrow.com/chat#contact"><h2>お問い合わせフォーム</h2><span>swarrow.com/chat#contact</span></a><a class="contact-qr" href="https://swarrow.com/chat#contact">{image('contactQr', alt='お問い合わせフォームのQRコード')}</a></section>
<footer class="page-foot"><span class="provider">サービス提供：株式会社Vecta</span><a class="site" href="https://swarrow.com/chat">swarrow.com/chat</a><span class="page-number">2 / 2</span></footer>
'''

(ROOT / 'brochure.css').write_text(CSS)
for number, html in ((1, p1), (2, p2)):
    (ROOT / f'SwarrowChat_パンフレット_{number}ページ目.html').write_text(page(html, number))
print(json.dumps({'pages': 2, 'font': 'Hiragino Sans W4/W6/W8', 'native_text': True, 'whole_page_raster': False}, ensure_ascii=False))
