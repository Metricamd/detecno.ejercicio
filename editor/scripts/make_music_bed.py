import numpy as np, wave, sys
sr=48000; dur=float(sys.argv[2]) if len(sys.argv)>2 else 28; t=np.arange(int(sr*dur))/sr
chords=[(261.6,329.6,392.0),(220.0,261.6,329.6),(174.6,220.0,261.6),(196.0,246.9,293.7)]
out=np.zeros_like(t)
seg=3.4
for i in range(int(dur/seg)+1):
    c=chords[i%4]; s=i*seg
    m=(t>=s)&(t<s+seg+0.6)
    tt=t[m]-s
    env=np.minimum(1,tt/0.4)*np.clip((seg+0.6-tt)/0.6,0,1)
    for f in c:
        out[m]+=env*(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt))/3
    # soft pluck arpeggio on 8ths (120bpm)
    for k in range(int(seg/0.25)):
        f=c[k%3]*2; st=s+k*0.25; m2=(t>=st)&(t<st+0.25); t2=t[m2]-st
        out[m2]+=0.25*np.sin(2*np.pi*f*t2)*np.exp(-t2*18)
out*=np.minimum(1,t/0.5)*np.clip((dur-t)/2,0,1)
out=out/np.abs(out).max()*0.5
d=(np.stack([out,out],1)*32767).astype('<i2')
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(d.tobytes()); w.close()
