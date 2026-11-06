"""Creates an original illustrative Spotlight Hotel concept video; not property footage."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, subprocess, os
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'assets/videos'; OUT.mkdir(parents=True, exist_ok=True)
WORK=ROOT/'assets/video-frames'; WORK.mkdir(exist_ok=True)
W,H=960,540
fontpaths=['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf']
regpaths=['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']
font=lambda size,bold=True: ImageFont.truetype(next(p for p in (fontpaths if bold else regpaths) if os.path.exists(p)),size)
for idx in range(4):
    im=Image.new('RGB',(W,H)); px=im.load()
    shades=[((9,17,33),(41,56,82)),((15,22,45),(52,72,107)),((25,33,49),(102,77,64)),((10,18,37),(28,42,75))]
    a,b=shades[idx]
    for y in range(H):
        for x in range(W):
            n=(y/H)*.75+(x/W)*.25
            light=max(0,1-math.hypot(x-740,y-210)/650)*.20
            px[x,y]=tuple(int(a[c]*(1-n)+b[c]*n+light*36) for c in range(3))
    d=ImageDraw.Draw(im,'RGBA')
    # Abstract spotlight rays, architectural silhouettes and slowly revealed light.
    for radius in (330,250,165): d.ellipse((650-radius,168-radius,650+radius,168+radius),outline=(242,189,105,65),width=2)
    d.polygon([(650,90),(40,540),(940,540)],fill=(246,194,107,18))
    if idx==1:
        d.rectangle((545,260,890,550),fill=(166,146,124,255));d.rectangle((580,305,660,500),fill=(45,51,67,255));d.rectangle((700,305,780,500),fill=(45,51,67,255));d.rectangle((810,305,870,500),fill=(45,51,67,255))
    if idx==2:
        for j in range(3):
            x=560+j*130;d.rounded_rectangle((x,240,x+85,510),radius=42,fill=(154,112,89,255));d.rounded_rectangle((x+17,280,x+67,500),radius=30,fill=(32,36,55,255))
    d.ellipse((66,55,90,79),fill=(244,189,104,255))
    d.text((105,54),'SPOTLIGHT HOTEL',font=font(18),fill=(246,235,213))
    d.line((65,100,895,100),fill=(255,255,255,55),width=2)
    messages=[('THE CITY','IN A NEW LIGHT.'),('ARRIVE.','UNWIND.'),('DISCOVER','NAWALGARH.'),('SPOTLIGHT','HOTEL.')]
    first,second=messages[idx]
    d.text((65,180),first,font=font(65),fill=(249,248,243))
    d.text((65,262),second,font=font(64),fill=(244,189,104))
    d.line((65,375,150,375),fill=(244,189,104),width=4)
    d.text((66,410),'ORIGINAL PROMOTIONAL CONCEPT / NOT ACTUAL HOTEL FOOTAGE',font=font(13),fill=(202,208,215))
    d.text((65,492),f'{idx+1:02d} / 04         NAWALGARH, RAJASTHAN',font=font(13),fill=(216,207,192))
    im.save(WORK/f'scene_{idx+1}.jpg',quality=92)
    if idx==0:im.save(ROOT/'assets/images/film-poster.jpg',quality=91)
for i in range(1,5):
    input_path=str(WORK/f'scene_{i}.jpg'); output_path=str(WORK/f'clip_{i}.mp4')
    filtergraph="scale=1020:574,zoompan=z='min(zoom+0.00065,1.08)':d=1:s=960x540:fps=24,fade=t=in:st=0:d=0.22,fade=t=out:st=2.72:d=0.28,format=yuv420p"
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-loop','1','-framerate','24','-i',input_path,'-vf',filtergraph,'-frames:v','72','-c:v','libx264','-preset','ultrafast','-crf','26','-pix_fmt','yuv420p',output_path],check=True)
concat=WORK/'concat.txt'; concat.write_text(''.join(f"file '{(WORK/f'clip_{i}.mp4').as_posix()}'\n" for i in range(1,5)))
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(concat),'-c','copy','-movflags','+faststart',str(OUT/'spotlight-concept.mp4')],check=True)
print('Wrote',OUT/'spotlight-concept.mp4')
