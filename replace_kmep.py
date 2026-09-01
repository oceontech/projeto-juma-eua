# -*- coding: utf-8 -*-
import re

with open('c:\\dev\\projeto-juma-eua\\site\\kmep-ultra-us.html', 'r', encoding='utf-8') as f:
    content = f.read()

# K1 Replacements
content = re.sub(
    r'<span data-en>INSECTICIDE POTENTIATOR · TANK MIX · FOLIAR POTASSIUM</span>',
    '<span data-en>FOLIAR POTASSIUM · CROP VIGOR · TANK MIX</span>',
    content
)
content = re.sub(
    r'<span data-pt>POTENCIALIZADOR DE INSETICIDA · MISTURA EM TANQUE · POTÁSSIO FOLIAR</span>',
    '<span data-pt>POTÁSSIO FOLIAR · VIGOR DA LAVOURA · MISTURA EM TANQUE</span>',
    content
)
content = re.sub(
    r'<span data-en>The one you didn\'t reach is the one that comes back.</span>',
    '<span data-en>Goes beyond traditional management.</span>',
    content
)
content = re.sub(
    r'<span data-pt>O que você não alcançou é o que volta.</span>',
    '<span data-pt>Vai além do manejo tradicional.</span>',
    content
)

en_k1_body = "KMEP Ultra® goes beyond traditional management by acting as a potassium source, contributing to grain fill, plant vigor, and improved crop performance throughout the entire growing cycle. In practice, this means healthier, balanced plants and greater efficiency in application use. As an added advantage: it also acts as a flushing agent, forcing insects out of hiding and into contact with insecticides."
pt_k1_body = "O KMEP Ultra® vai além do manejo tradicional ao atuar como fonte de potássio, contribuindo para o enchimento de grãos, o vigor das plantas e a melhoria do desempenho da lavoura ao longo de todo o ciclo de cultivo. Na prática, isso significa plantas mais saudáveis e equilibradas e maior eficiência no uso das aplicações. Como vantagem adicional: também atua como agente desalojante, forçando os insetos a saírem de seus abrigos e entrarem em contato com os inseticidas."

content = re.sub(
    r'<span data-en>KMEP Ultra® goes in the tank mixed.*?foliar potassium riding along in the same droplet\.</span>',
    f'<span data-en>{en_k1_body}</span>',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'<span data-pt>O KMEP Ultra® vai no tanque misturado.*?potássio\s+foliar na mesma gota\.</span>',
    f'<span data-pt>{pt_k1_body}</span>',
    content,
    flags=re.DOTALL
)

# K2 Replacements
content = re.sub(
    r'<span data-en>You sprayed\. Days later, they\'re back\.</span>',
    '<span data-en>The potassium your plant needs, right when it needs it most.</span>',
    content
)
content = re.sub(
    r'<span data-pt>Você pulverizou\. Dias depois, eles voltaram\.</span>',
    '<span data-pt>O potássio que sua planta precisa, exatamente quando ela mais precisa.</span>',
    content
)

en_k2_body = "Potassium demand peaks late — through pollination and grain fill. Even if it is in the ground, it might not be in the plant during the weeks that set the kernel. KMEP Ultra® delivers it precisely then, in the same pass you already have scheduled."
pt_k2_body = "A demanda por potássio tem pico no fim do ciclo — na polinização e enchimento de grãos. Mesmo estando no solo, pode não estar na planta nas semanas que definem o grão. KMEP Ultra® entrega exatamente aí, na mesma aplicação já programada."

content = re.sub(
    r'<span data-en>The application was right.*?speeds up resistance selection\.</span>',
    f'<span data-en>{en_k2_body}</span>',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'<span data-pt>A aplicação estava certa.*?acelera a seleção de resistência\.</span>',
    f'<span data-pt>{pt_k2_body}</span>',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'<span data-en>The insecticide didn\'t fail\. It never got to act on the insect\.</span>',
    '<span data-en>Healthier plants, better physiological response, and more efficiency.</span>',
    content
)
content = re.sub(
    r'<span data-pt>O inseticida não falhou\. Ele nunca chegou a agir em cima do inseto\.</span>',
    '<span data-pt>Plantas mais saudáveis, melhor resposta fisiológica e mais eficiência.</span>',
    content
)
content = re.sub(
    r'<span data-en>AND THE SAME PASS CARRIES SOMETHING ELSE</span>',
    '<span data-en>AND AN ADDED ADVANTAGE AGAINST PESTS</span>',
    content
)
content = re.sub(
    r'<span data-pt>E A MESMA APLICAÇÃO CARREGA MAIS UMA COISA</span>',
    '<span data-pt>E UMA VANTAGEM ADICIONAL CONTRA PRAGAS</span>',
    content
)
content = re.sub(
    r'<span data-en>Potassium demand peaks late.*?can actually move\.</span>',
    '<span data-en>You sprayed. Days later, they\'re back. The insecticide didn\'t fail — it just never reached the hidden insects. KMEP Ultra® acts as a flushing agent, moving the target out of hiding.</span>',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'<span data-pt>A demanda por potássio tem pico.*?de fato movimentar\.</span>',
    '<span data-pt>Você pulverizou. Dias depois, eles voltaram. O inseticida não falhou — ele apenas nunca alcançou os insetos escondidos. O KMEP Ultra® atua como agente desalojante, tirando o alvo do esconderijo.</span>',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'<span data-en>The potassium is in the ground.*?chance you get to put it there\.</span>',
    '<span data-en>The target leaves the whorl and the underside of the leaf, stopping where the insecticide can actually act on it.</span>',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'<span data-pt>O potássio está no solo.*?chance mais barata de colocá-lo lá\.</span>',
    '<span data-pt>O alvo deixa o cartucho e a face inferior da folha, parando onde o inseticida consegue de fato agir sobre ele.</span>',
    content,
    flags=re.DOTALL
)

# K3 Replacements
content = re.sub(
    r'<span data-en>Mix it in\. Move the target\. Keep it exposed\.</span>',
    '<span data-en>Nutrition first. Added pest control efficiency.</span>',
    content
)
content = re.sub(
    r'<span data-pt>Misturar\. Desalojar\. Manter exposto\.</span>',
    '<span data-pt>Nutrição primeiro. Eficiência adicional no controle.</span>',
    content
)
content = re.sub(
    r'<span data-en>Three steps, in the order they happen in the tank and on the plant\.</span>',
    '<span data-en>A complete physiological response with an added defensive advantage.</span>',
    content
)
content = re.sub(
    r'<span data-pt>Três passos, na ordem em que acontecem no tanque e na planta\.</span>',
    '<span data-pt>Uma resposta fisiológica completa com uma vantagem defensiva adicional.</span>',
    content
)

content = re.sub(
    r'<p class="eyebrow" style="margin-bottom:6px">02 — <span data-en>OUT OF HIDING</span><span data-pt>DESALOJAMENTO</span></p>\s*<p class="corpo" style="margin:0">\s*<span data-en>The target leaves the whorl, the underside of the leaf, the sheath, the\s*crevice — the places a droplet was never going to reach\.</span>\s*<span data-pt>O alvo deixa o cartucho, a face inferior da folha, a bainha, a fenda — os\s*pontos onde a gota nunca ia chegar\.</span>\s*</p>',
    '<p class="eyebrow" style="margin-bottom:6px">02 — <span data-en>FOLIAR POTASSIUM &amp; VIGOR</span><span data-pt>POTÁSSIO FOLIAR E VIGOR</span></p>\\n<p class="corpo" style="margin:0">\\n<span data-en>Contributes to grain fill and crop performance, meaning healthier and more balanced plants throughout the growing cycle.</span>\\n<span data-pt>Contribui para o enchimento de grãos e desempenho da lavoura, significando plantas mais saudáveis e equilibradas ao longo do ciclo.</span>\\n</p>',
    content
)
content = re.sub(
    r'<p class="eyebrow" style="margin-bottom:6px">03 — <span data-en>EXPOSED, AND STILL</span><span data-pt>EXPOSTO E PARADO</span></p>\s*<p class="corpo" style="margin:0">\s*<span data-en>Out in the open it stops moving and stays in contact with the spray, which\s*now has time to act on the insect instead of drying on the leaf\.</span>\s*<span data-pt>No aberto ele paralisa e permanece em contato com a calda, que agora tem\s*tempo de agir sobre o inseto em vez de secar na folha\.</span>\s*</p>',
    '<p class="eyebrow" style="margin-bottom:6px">03 — <span data-en>ADDED BENEFIT: OUT OF HIDING</span><span data-pt>VANTAGEM ADICIONAL: DESALOJAMENTO</span></p>\\n<p class="corpo" style="margin:0">\\n<span data-en>Forces insects to leave their shelters and come into contact with the insecticide, maximizing the overall pest control efficiency.</span>\\n<span data-pt>Força os insetos a saírem de seus abrigos e entrarem em contato com o inseticida, aumentando a eficiência geral do controle de pragas.</span>\\n</p>',
    content
)

content = re.sub(
    r'<div style="margin-top:18px;border-top:1px solid var\(--linha\);padding-top:18px">\s*<p class="eyebrow" style="margin-bottom:6px"><span data-en>AND IN THE SAME DROPLET</span><span data-pt>E NA MESMA GOTA</span></p>\s*<p class="corpo" style="margin:0">\s*<span data-en>Foliar potassium, in a form the leaf takes up — no waiting on soil moisture\.</span>\s*<span data-pt>Potássio foliar, numa forma que a folha absorve — sem esperar umidade do solo\.</span>\s*</p>\s*</div>',
    '',
    content
)

# K4 Replacements
content = re.sub(
    r'<h3 class="h-sm"><span data-en>Goes in with the insecticide you already bought</span><span data-pt>Entra junto com o inseticida que você já comprou</span></h3>\s*<p class="corpo" style="margin:0"><span data-en>Compatible in tank mix\. No separate pass, no extra diesel, no new weather window\.</span>\s*<span data-pt>Compatível em mistura\. Sem aplicação separada, sem diesel extra, sem nova janela de clima\.</span></p>',
    '<h3 class="h-sm"><span data-en>Healthier &amp; Balanced Plants</span><span data-pt>Plantas mais saudáveis e equilibradas</span></h3>\\n<p class="corpo" style="margin:0"><span data-en>Improves overall physiological response across the crop cycle.</span>\\n<span data-pt>Melhora a resposta fisiológica geral ao longo de todo o ciclo da cultura.</span></p>',
    content
)
content = re.sub(
    r'<h3 class="h-sm"><span data-en>The insecticide acts on more of the population</span><span data-pt>O inseticida age sobre mais da população</span></h3>\s*<p class="corpo" style="margin:0"><span data-en>The target comes out of hiding and stays exposed\. Same rate, more of it reached — efficiency, not a stretched jug\.</span>\s*<span data-pt>O alvo sai do esconderijo e fica exposto\. Mesma dose, mais alvo alcançado — eficiência, não produto rendendo mais\.</span></p>',
    '<h3 class="h-sm"><span data-en>Better Crop Performance</span><span data-pt>Melhor desempenho da lavoura</span></h3>\\n<p class="corpo" style="margin:0"><span data-en>Acts as a potassium source contributing directly to grain fill and productivity.</span>\\n<span data-pt>Atua como fonte de potássio contribuindo diretamente para o enchimento de grãos e a produtividade.</span></p>',
    content
)
content = re.sub(
    r'<h3 class="h-sm"><span data-en>Foliar potassium in the same pass</span><span data-pt>Potássio foliar na mesma aplicação</span></h3>\s*<p class="corpo" style="margin:0"><span data-en>In a form the leaf takes up, positioned for the window where demand actually peaks\.</span>\s*<span data-pt>Numa forma que a folha absorve, posicionado para a janela em que a demanda realmente tem pico\.</span></p>',
    '<h3 class="h-sm"><span data-en>Added Benefit: Flushing Agent</span><span data-pt>Vantagem Adicional: Ação Desalojante</span></h3>\\n<p class="corpo" style="margin:0"><span data-en>Forces insects to leave their shelters, improving the efficiency of the insecticide in the tank mix.</span>\\n<span data-pt>Força os insetos a deixarem seus abrigos, melhorando a eficiência do inseticida na mistura.</span></p>',
    content
)

with open('c:\\dev\\projeto-juma-eua\\site\\kmep-ultra-us.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
