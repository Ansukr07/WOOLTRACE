import re

css_path = '/home/jayy/sih/src/pages/farmer/Market.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

badge_target = '''.channel-badge.blue { background: #BED5E5; color: #0B120D; }
.channel-badge.green { background: #DDFF86; color: #0B120D; }
.channel-badge.purple { background: #E9D5FF; color: #581C87; }
.channel-badge.gold { background: #FEF08A; color: #854D0E; }'''

badge_replacement = '''.channel-badge.blue { background: #BED5E5; color: #0B120D; }
.channel-badge.green { background: #DDFF86; color: #0B120D; }
.channel-badge.ivory { background: #EDEDCE; color: #0B120D; }
.channel-badge.coral { background: #FFAAA4; color: #0B120D; }
.channel-badge.ink { background: #0B120D; color: #FFFFFF; }'''

css = css.replace(badge_target, badge_replacement)
css = css.replace('.market-card.lime { background: #F4FDE5; border-color: rgba(221, 255, 134, 0.4); }', '.market-card.lime { background: #FFFFFF; border-left: 4px solid #DDFF86; }')
css = css.replace('.market-card.sky { background: #F0F6FA; border-color: rgba(190, 213, 229, 0.4); }', '.market-card.sky { background: #FFFFFF; border-left: 4px solid #BED5E5; }')
css = css.replace('.market-card.ivory { background: #FAF9ED; border-color: rgba(237, 237, 206, 0.5); }', '.market-card.ivory { background: #FFFFFF; border-left: 4px solid #EDEDCE; }')
css = css.replace('.market-card.coral { background: #FFF5F4; border-color: rgba(255, 170, 164, 0.4); }', '.market-card.coral { background: #FFFFFF; border-left: 4px solid #FFAAA4; }')

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated Market.css successfully')

mis_path = '/home/jayy/sih/src/services/market/marketIntelligenceService.js'
with open(mis_path, 'r', encoding='utf-8') as f:
    mis = f.read()

mis = mis.replace(