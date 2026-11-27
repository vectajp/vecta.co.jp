<script lang="ts">
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";
  import Check from "@lucide/svelte/icons/check";
  import ClipboardList from "@lucide/svelte/icons/clipboard-list";
  import FileText from "@lucide/svelte/icons/file-text";
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import Phone from "@lucide/svelte/icons/phone";
  import PhoneForwarded from "@lucide/svelte/icons/phone-forwarded";
</script>

<section class="details handoff" aria-labelledby="call-handoff-title">
  <div class="container">
    <h2 id="call-handoff-title">代表電話の取次と申し送り</h2>
    <p class="lead">
      AIが住民の用件を聞き取り、担当職員に内容を伝えてから通話を接続します。担当職員は相談内容を把握したうえで応対を始められます。
    </p>
    <figure class="handoff-figure">
      <ol class="handoff-flow">
        <li>
          <div class="phase">
            <span>01</span>
            <h3>用件を聞き取る</h3>
          </div>
          <div class="conversation">
            <span class="speaker"
              ><Phone size={22} stroke-width={1.6} />住民</span
            >
            <p class="speech">施設の利用について担当の方に相談したいです</p>
            <div class="voice" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
            <span class="speaker ai"
              ><img
                src="/swarrow/icon.png"
                alt=""
                width="28"
                height="28"
              >SwarrowCall</span
            >
          </div>
          <p class="step-body">
            相談内容を確認し、登録された部署・担当者から取次先を選びます。
          </p>
          <ArrowRight
            class="step-arrow"
            size={27}
            stroke-width={1.6}
            aria-hidden="true"
          />
        </li>
        <li class="handoff-step">
          <div class="phase">
            <span>02</span>
            <h3>職員に申し送る</h3>
          </div>
          <div class="handoff-note">
            <span class="note-title"
              ><ClipboardList
                size={22}
                stroke-width={1.6}
              />聞き取った内容</span
            >
            <dl>
              <div>
                <dt>用件</dt>
                <dd>施設利用の相談</dd>
              </div>
              <div>
                <dt>確認事項</dt>
                <dd>利用目的・希望日時</dd>
              </div>
              <div>
                <dt>取次先</dt>
                <dd>施設担当</dd>
              </div>
            </dl>
          </div>
          <p class="step-body">
            通話をつなぐ前に、AIが担当職員へ用件や確認事項を音声で伝えます。
          </p>
          <ArrowRight
            class="step-arrow"
            size={27}
            stroke-width={1.6}
            aria-hidden="true"
          />
        </li>
        <li>
          <div class="phase">
            <span>03</span>
            <h3>了承後に通話をつなぐ</h3>
          </div>
          <div class="connection">
            <PhoneForwarded size={49} stroke-width={1.4} aria-hidden="true" />
            <p class="speech">内容を確認しました<br>おつなぎください</p>
            <span class="connected"
              ><Check size={18} stroke-width={2} />住民と担当職員が通話</span
            >
          </div>
          <p class="step-body">
            担当職員の了承を確認して接続し、そのまま住民との対応を引き継ぎます。
          </p>
        </li>
      </ol>
      <figcaption>取次・申し送りのイメージ</figcaption>
    </figure>
    <div class="handoff-settings">
      <h3>電話環境と受付業務に合わせて設定</h3>
      <p>
        取次先の部署・担当者、受付時間、不在時の案内、聞き取る項目を整理します。既存の電話設備に合わせて接続方法を確認し、実際の電話で検証します。
      </p>
    </div>
  </div>
</section>

<section class="details applications" aria-labelledby="call-applications-title">
  <div class="container">
    <h2 id="call-applications-title">回答や予約受付にも活用</h2>
    <p class="lead">
      代表電話の取次に加え、よくある質問への回答や、予約に必要な情報の聞き取りなど、対象業務に合わせて電話対応の流れを構成できます。
    </p>
    <div class="application-grid">
      <article>
        <h3>
          <MessageCircle
            size={27}
            stroke-width={1.6}
          />FAQや手順書をもとに音声回答
        </h3>
        <figure class="answer-diagram">
          <div class="question-example">
            <Phone size={22} stroke-width={1.6} />
            <p>施設の利用方法を教えてください</p>
          </div>
          <div class="knowledge">
            <FileText size={28} stroke-width={1.5} />
            <div>
              <strong>FAQ・手順書</strong><span>登録した案内情報を参照</span>
            </div>
          </div>
          <div class="answer-example">
            <img src="/swarrow/icon.png" alt="" width="30" height="30">
            <p>利用条件や申込方法を音声で案内</p>
          </div>
          <figcaption>音声回答の流れ</figcaption>
        </figure>
        <p>
          施設や手続きの案内など、繰り返し寄せられる質問に対応します。職員による確認が必要な用件は、取次の流れにつなげます。
        </p>
      </article>
      <article>
        <h3>
          <CalendarDays
            size={27}
            stroke-width={1.6}
          />電話で予約に必要な情報を受付
        </h3>
        <figure class="reservation-diagram">
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>希望する日時や内容を聞く</strong>
                <p>相談・施設利用など対象業務に沿って確認</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>受付に必要な項目を確認</strong>
                <p>氏名・連絡先など設定した項目を聞き取り</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>内容を確認して予約を受付</strong>
                <p>予約枠や登録先を業務に合わせて設定</p>
              </div>
            </li>
          </ol>
          <figcaption>予約受付の構成例</figcaption>
        </figure>
        <p>
          電話で聞き取る項目と受付の流れを設定します。予約枠の管理方法や外部システムとの連携範囲は、導入時に確認します。
        </p>
      </article>
    </div>
  </div>
</section>

<style>
  .container {
    width: 85.6%;
    max-width: 1360px;
    margin-inline: auto;
  }
  .details {
    padding-block: 64px;
    color: var(--sc-navy);
  }
  h2,
  h3,
  p,
  figure,
  dl,
  dd {
    margin: 0;
  }
  h2 {
    font-size: clamp(27px, 2.3vw, 40px);
    font-weight: 800;
    line-height: 1.4;
    letter-spacing: -0.035em;
  }
  h3 {
    font-size: clamp(18px, 1.65vw, 25px);
    font-weight: 750;
    line-height: 1.5;
  }
  p {
    color: var(--sc-text-secondary);
    font-size: 16px;
    line-height: 1.85;
  }
  .lead {
    max-width: 960px;
    margin-top: 22px;
    font-size: clamp(16px, 1.2vw, 20px);
  }
  .handoff {
    padding-top: 0;
  }
  .handoff-figure {
    margin-top: 38px;
  }
  .handoff-flow {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 42px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .handoff-flow > li {
    position: relative;
    min-width: 0;
  }
  .phase {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .phase > span {
    font-size: 28px;
    font-weight: 750;
    color: var(--sc-blue);
  }
  .conversation,
  .handoff-note,
  .connection {
    box-sizing: border-box;
    min-height: 250px;
    padding: 25px;
    border-radius: 14px;
    background: var(--sc-bg-light);
  }
  .speaker {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 650;
  }
  .speech {
    padding: 15px 18px;
    border-radius: 10px;
    background: white;
    color: var(--sc-navy);
    font-size: 15px;
    line-height: 1.8;
  }
  .conversation .speech {
    margin-top: 15px;
  }
  .voice {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    height: 29px;
    margin-block: 10px;
  }
  .voice i {
    width: 4px;
    height: 10px;
    border-radius: 4px;
    background: var(--sc-blue);
  }
  .voice i:nth-child(2n) {
    height: 18px;
  }
  .voice i:nth-child(3n) {
    height: 27px;
  }
  .handoff-note {
    background: var(--sc-navy);
    color: white;
  }
  .note-title {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 17px;
    font-weight: 650;
    padding-bottom: 18px;
    border-bottom: 1px solid #ffffff40;
  }
  .handoff-note dl {
    display: grid;
    gap: 17px;
    padding-top: 20px;
  }
  .handoff-note dl > div {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 10px;
    align-items: baseline;
  }
  .handoff-note dt {
    color: #b8d1f3;
    font-size: 13px;
  }
  .handoff-note dd {
    font-size: 15px;
    line-height: 1.6;
  }
  .connection {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 18px;
    background: #eef7f4;
    color: var(--sc-diagram-green);
  }
  .connected {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #35664d;
    font-size: 14px;
    font-weight: 650;
  }
  .step-body {
    margin-top: 18px;
    font-size: 15px;
  }
  .handoff-flow :global(.step-arrow) {
    position: absolute;
    right: -35px;
    top: 170px;
    color: var(--sc-blue);
  }
  figcaption {
    text-align: center;
    color: var(--sc-text-secondary);
    font-size: 13px;
    line-height: 1.7;
    margin-top: 14px;
  }
  .handoff-settings {
    display: grid;
    grid-template-columns: 1fr 1.7fr;
    gap: 40px;
    border-top: 1px solid #d6e2ee;
    margin-top: 32px;
    padding-top: 28px;
  }
  .handoff-settings p {
    font-size: 15px;
  }
  .applications {
    background: var(--sc-bg-light);
  }
  .application-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 60px;
    margin-top: 40px;
  }
  .application-grid h3 {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .question-example :global(svg),
  .answer-example img {
    flex-shrink: 0;
  }
  .application-grid h3 :global(svg) {
    flex-shrink: 0;
    color: var(--sc-blue);
  }
  .application-grid article > p {
    margin-top: 22px;
  }
  .answer-diagram,
  .reservation-diagram {
    margin-top: 24px;
    min-height: 300px;
    box-sizing: border-box;
    padding: 28px;
    border-radius: 14px;
    background: white;
  }
  .question-example,
  .answer-example {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 15px;
    border-radius: 9px;
    background: var(--sc-bg-light);
  }
  .question-example p,
  .answer-example p {
    color: var(--sc-navy);
    font-size: 14px;
  }
  .knowledge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px 0;
    color: var(--sc-blue);
  }
  .knowledge strong,
  .knowledge span {
    display: block;
  }
  .knowledge strong {
    font-size: 16px;
  }
  .knowledge span {
    margin-top: 4px;
    font-size: 13px;
    color: var(--sc-text-secondary);
  }
  .reservation-diagram ol {
    display: grid;
    gap: 22px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .reservation-diagram li {
    display: flex;
    align-items: flex-start;
    gap: 15px;
  }
  .reservation-diagram li > span {
    display: grid;
    place-items: center;
    width: 29px;
    height: 29px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #eef7f4;
    color: #35664d;
    font-weight: 750;
  }
  .reservation-diagram strong {
    font-size: 16px;
    line-height: 1.8;
  }
  .reservation-diagram li p {
    font-size: 13px;
  }
  @media (max-width: 1100px) {
    .handoff-flow {
      gap: 30px;
    }
    .handoff-flow :global(.step-arrow) {
      right: -27px;
      width: 23px;
    }
    .phase {
      gap: 8px;
    }
    .phase > span {
      font-size: 24px;
    }
    .phase h3 {
      font-size: 17px;
    }
    .conversation,
    .handoff-note,
    .connection {
      padding: 20px 16px;
      min-height: 260px;
    }
    .handoff-note dl > div {
      grid-template-columns: 1fr;
      gap: 4px;
    }
    .application-grid {
      gap: 35px;
    }
    .answer-diagram,
    .reservation-diagram {
      padding: 23px;
      min-height: 330px;
    }
  }
  @media (max-width: 860px) {
    .container {
      width: calc(100% - 40px);
    }
    .details {
      padding-block: 48px;
    }
    .handoff {
      padding-top: 0;
    }
    .handoff-flow,
    .application-grid,
    .handoff-settings {
      grid-template-columns: 1fr;
    }
    .handoff-flow {
      gap: 40px;
    }
    .handoff-flow :global(.step-arrow) {
      right: calc(50% - 13px);
      top: auto;
      bottom: -32px;
      transform: rotate(90deg);
    }
    .phase h3 {
      font-size: 21px;
    }
    .phase > span {
      font-size: 28px;
    }
    .conversation,
    .handoff-note,
    .connection {
      min-height: 220px;
      padding: 24px;
    }
    .handoff-note dl > div {
      grid-template-columns: 64px 1fr;
      gap: 12px;
    }
    .handoff-settings {
      gap: 15px;
    }
    .application-grid {
      gap: 40px;
      margin-top: 30px;
    }
    .application-grid h3 {
      font-size: 21px;
      align-items: flex-start;
    }
    .application-grid h3 :global(svg) {
      margin-top: 3px;
    }
    .answer-diagram,
    .reservation-diagram {
      min-height: 0;
      padding: 24px 20px;
    }
  }
</style>
