// Ölçekhane sesli okuma: mikrofondan gelen sesi parça parça sayfaya iletir (AudioWorklet).
// Ses yalnızca açık olan sayfanın belleğine gider; hiçbir yere gönderilmez ve kaydedilmez.
class OlcekhaneKayit extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(2048);
    this.n = 0;
  }

  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      for (let i = 0; i < ch.length; i++) {
        this.buf[this.n++] = ch[i];
        if (this.n === this.buf.length) {
          this.port.postMessage(this.buf, [this.buf.buffer]);
          this.buf = new Float32Array(2048);
          this.n = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('olcekhane-kayit', OlcekhaneKayit);
