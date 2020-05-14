import moment from 'moment-timezone';

export default class TranslationService {
  constructor() {
    this._strings = {
      // --------------------
      // French
      // --------------------
      fr: {
        'GLOBAL.BEDTIME': 'Heure de couché : <b>{{time}}</b>',
        'GLOBAL.NO_DATA': 'Il n’y a pas de donnée pour la période concernée.',
        'GLOBAL.WAKE_UP_TIME': 'Heure de réveil : <b>{{time}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_MANY_MOVES': '{{room}} <b>{{number}} mouvements</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_ONE_MOVE': '{{room}} <b>{{number}} mouvement</b>',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_MANY_MOVES': '{{date}} - {{number}} mouvements au total',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_ONE_MOVE': '{{date}} - {{number}} mouvement au total',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_MANY_MOVES': 'Ce mois, le bénéficiaire {{name}} a été détecté <b>{{number}}</b> fois.',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_ONE_MOVE': 'Ce mois, le bénéficiaire {{name}} a été détecté <b>{{number}}</b> fois.',
        'OUTINGS.OUTING_DETAILS': '<b>Sortie #{{number}}</b> : de {{fromTime}} à {{toTime}}',
        'PRESENCES.BED': 'Lit ({{room}})',
        'PRESENCES.DOOR': 'Porte ({{room}})',
        'PRESENCES.DURATION': '<b>Durée</b> : {{duration}}',
        'PRESENCES.OUTINGS': 'Sorties',
        'PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION': 'Durée du sommeil quotidien',
        'PRESENCES_AND_SLEEPS.DURATION': 'Durée : <b>{{duration}}</b>',
        'PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT': 'Nombre de levers nocturnes : <b>{{number}}</b>',
        'PRESENCES_AND_SLEEPS.PRESENCES': 'Présences',
        'PRESENCES_AND_SLEEPS.SLEEP': 'Sommeil',
        'SLEEPS.HEADER': 'Le {{date}}',
        'SLEEPS.SLEEP_DURATION': 'Durée du sommeil : <b>{{duration}}</b>',
        'SLEEPS.SLEEPS_DAILY_AVERAGES': 'Moyenne des {{day}} : <b>{{duration}}</b>',
        'SLEEPS_LEGACY.DIDNT_WAKE_UP_OVERNIGHT': 'Pas de levé pendant la nuit',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_MANY_TIMES': "S'est levé(e) à {{number}} reprises",
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_ONE_TIME': "S'est levé(e) à {{number}} reprise"
      },
      // --------------------
      // English
      // --------------------
      en: {
        'GLOBAL.BEDTIME': 'Bed time: <b>{{time}}</b>',
        'GLOBAL.NO_DATA': 'There is no data for the given period.',
        'GLOBAL.WAKE_UP_TIME': 'Wake time: <b>{{time}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_MANY_MOVES': '{{room}} <b>{{number}} movements</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_ONE_MOVE': '{{room}} <b>{{number}} movement</b>',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_MANY_MOVES': '{{date}} - {{number}} total moves',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_ONE_MOVE': '{{date}} - {{number}} total move',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_MANY_MOVES': 'This month, the beneficiary {{name}} was detected <b>{{number}}</b> times.',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_ONE_MOVE': 'This month, the beneficiary {{name}} was detected <b>{{number}}</b> time.',
        'OUTINGS.OUTING_DETAILS': '<b>Outing #{{number}}</b> from {{fromTime}} to {{toTime}}',
        'PRESENCES.BED': 'Bed ({{room}})',
        'PRESENCES.DOOR': 'Door ({{room}})',
        'PRESENCES.DURATION': '<b>Duration</b>: {{duration}}',
        'PRESENCES.OUTINGS': 'Outings',
        'PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION': 'Daily sleep duration',
        'PRESENCES_AND_SLEEPS.DURATION': 'Duration: <b>{{duration}}</b>',
        'PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT': 'Number of wakeup overnight: <b>{{number}}</b>',
        'PRESENCES_AND_SLEEPS.PRESENCES': 'Presences',
        'PRESENCES_AND_SLEEPS.SLEEP': 'Sleep',
        'SLEEPS.HEADER': 'On {{date}}',
        'SLEEPS.SLEEP_DURATION': 'Sleep duration <b>{{duration}}</b>',
        'SLEEPS.SLEEPS_DAILY_AVERAGES': '{{day}} average: <b>{{duration}}</b>',
        'SLEEPS_LEGACY.DIDNT_WAKE_UP_OVERNIGHT': 'No wakup overnight',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_MANY_TIMES': 'Woke up {{number}} times',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_ONE_TIME': 'Woke up {{number}} time'
      },
      // --------------------
      // Chinese
      // --------------------
      zh: {
        'GLOBAL.BEDTIME': '躺在时间：<b>{{time}}</b>的',
        'GLOBAL.NO_DATA': '有对有关期间没有数据。',
        'GLOBAL.WAKE_UP_TIME': '唤醒时间：<b>{{time}}</b>的',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_MANY_MOVES': '{{room}} 的 <b>{{number}} 运动</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_ONE_MOVE': '{{room}} 的 <b>{{number}} 运动</b>',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_MANY_MOVES': '{{date}}  -  {{number}} 总运动',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_ONE_MOVE': '{{date}}  -  {{number}} 运动总',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_MANY_MOVES': '这个月，收件人检测{{name}}的 <b>{{number}} </b> 一次。',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_ONE_MOVE': '这个月，收件人检测{{name}}的 <b>{{number}} </b> 一次。',
        'OUTINGS.OUTING_DETAILS': '<b>输出#{{number}} </b> 的 {{fromTime}} 到 {{toTime}}',
        'PRESENCES.BED': '摔跤（{{room}}）',
        'PRESENCES.DOOR': '门（{{room}}）',
        'PRESENCES.DURATION': '<b>时间</b> 的：{{duration}}',
        'PRESENCES.OUTINGS': '输出',
        'PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION': '一天的睡眠时间',
        'PRESENCES_AND_SLEEPS.DURATION': '持续时间：<b>{{duration}}</b>的',
        'PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT': '杠杆夜曲名：<b>{{number}}</b>的',
        'PRESENCES_AND_SLEEPS.PRESENCES': '勤',
        'PRESENCES_AND_SLEEPS.SLEEP': '睡觉',
        'SLEEPS.HEADER': '该 {{date}}',
        'SLEEPS.SLEEP_DURATION': '睡眠时间的 <b>{{duration}}</b>的',
        'SLEEPS.SLEEPS_DAILY_AVERAGES': '平均{{day}}：<b>{{duration}}</b>的',
        'SLEEPS_LEGACY.DIDNT_WAKE_UP_OVERNIGHT': '没有过夜',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_MANY_TIMES': '罗斯（E）{{number}}倍',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_ONE_TIME': '罗斯（五）恢复{{number}}'
      },
      // --------------------
      // Spanish
      // --------------------
      es: {
        'GLOBAL.BEDTIME': 'Tiempo tumbado: <b>{{time}}</b>',
        'GLOBAL.NO_DATA': 'No hay datos para el período en cuestión.',
        'GLOBAL.WAKE_UP_TIME': 'Hora del temporizador: <b>{{time}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_MANY_MOVES': '{{room}} <b>movimientos {{number}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_ONE_MOVE': '{{room}} <b>movimiento {{number}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_MANY_MOVES': '{{date}} - movimientos totales {{number}}',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_ONE_MOVE': '{{date}} - movimiento total {{number}}',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_MANY_MOVES': 'Este mes, el receptor se detectó {{name}} <b>{{number}}</b> vezes.',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_ONE_MOVE': 'Este mes, el receptor se detectó {{name}} <b>{{number}}</b> vez.',
        'OUTINGS.OUTING_DETAILS': '<b>#{{number}} salida</b> de {{fromTime}} a {{toTime}}',
        'PRESENCES.BED': 'Lucha ({{room}})',
        'PRESENCES.DOOR': 'Puerta ({{room}})',
        'PRESENCES.DURATION': '<b>Tiempo</b>: {{duration}}',
        'PRESENCES.OUTINGS': 'Salidas',
        'PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION': 'Duración diaria del sueño',
        'PRESENCES_AND_SLEEPS.DURATION': 'Duración: <b>{{duration}}</b>',
        'PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT': 'Número de amaneceres nocturnos : <b>{{number}}</b>',
        'PRESENCES_AND_SLEEPS.PRESENCES': 'Asistencia',
        'PRESENCES_AND_SLEEPS.SLEEP': 'Sueño',
        'SLEEPS.HEADER': 'El {{date}}',
        'SLEEPS.SLEEP_DURATION': 'La duración del sueño <b>{{duration}}</b>',
        'SLEEPS.SLEEPS_DAILY_AVERAGES': '{{day}} media: <b>{{duration}}</b>',
        'SLEEPS_LEGACY.DIDNT_WAKE_UP_OVERNIGHT': 'No hay un día para otro',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_MANY_TIMES': 'Se levantó {{number}} veces',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_ONE_TIME': 'Se levantó {{number}} vez'
      },
      // --------------------
      // Slovak
      // --------------------
      sk: {
        'GLOBAL.BEDTIME': 'Ležiace čas: <b>{{time}}</b>',
        'GLOBAL.NO_DATA': 'Neexistuje žiadne dáta pre danú dobu.',
        'GLOBAL.WAKE_UP_TIME': 'Prebudiť Čas: <b>{{time}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_MANY_MOVES': '{{room}} <b>pohyby {{number}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_ONE_MOVE': '{{room}} <b>{{number}} pohyb</b>',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_MANY_MOVES': '{{date}} - {{number}} celkovej pohyby',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_ONE_MOVE': '{{date}} - {{number}} pohyb Total',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_MANY_MOVES': 'Tento mesiac príjemcu bola detekovaná {{name}} <b>{{number}}</b> raz.',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_ONE_MOVE': 'Tento mesiac príjemcu bola detekovaná {{name}} <b>{{number}}</b> raz.',
        'OUTINGS.OUTING_DETAILS': '<b>Výstup #{{number}}</b> {{fromTime}} na {{toTime}}',
        'PRESENCES.BED': 'Zápasí ({{room}})',
        'PRESENCES.DOOR': 'Dvere ({{room}})',
        'PRESENCES.DURATION': '<b>Čas</b>: {{duration}}',
        'PRESENCES.OUTINGS': 'Výstupy',
        'PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION': 'Denná doba spánku',
        'PRESENCES_AND_SLEEPS.DURATION': 'Doba trvania: <b>{{duration}}</b>',
        'PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT': 'Páky Nokturna name: <b>{{number}}</b>',
        'PRESENCES_AND_SLEEPS.PRESENCES': 'Prezencia',
        'PRESENCES_AND_SLEEPS.SLEEP': 'Spánok',
        'SLEEPS.HEADER': '{{date}}',
        'SLEEPS.SLEEP_DURATION': 'Doba spánku <b>{{duration}}</b>',
        'SLEEPS.SLEEPS_DAILY_AVERAGES': 'Priemerná {{day}}: <b>{{duration}}</b>',
        'SLEEPS_LEGACY.DIDNT_WAKE_UP_OVERNIGHT': 'Žiadny zo dňa na deň',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_MANY_TIMES': 'Vstal {{number}} päťkrát',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_ONE_TIME': 'Vstal {{number}} päťkrát'
      },
      // --------------------
      // Czech
      // --------------------
      cs: {
        'GLOBAL.BEDTIME': 'Ležící čas: <b>{{time}}</b>',
        'GLOBAL.NO_DATA': 'Neexistuje žádná data pro danou dobu.',
        'GLOBAL.WAKE_UP_TIME': 'Probudit Čas: <b>{{time}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_MANY_MOVES': '{{room}} <b>pohyby {{number}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_ONE_MOVE': '{{room}} <b>{{number}} pohyb</b>',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_MANY_MOVES': '{{date}} - {{number}} celkové pohyby',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_ONE_MOVE': '{{date}} - {{number}} pohyb Total',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_MANY_MOVES': 'Tento měsíc příjemce byla detekována {{name}} <b>{{number}}</b> jednou.',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_ONE_MOVE': 'Tento měsíc příjemce byla detekována {{name}} <b>{{number}}</b> jednou.',
        'OUTINGS.OUTING_DETAILS': '<b>Výstup #{{number}}</b> {{fromTime}} na {{toTime}}',
        'PRESENCES.BED': 'Zápasí ({{room}})',
        'PRESENCES.DOOR': 'Dveře ({{room}})',
        'PRESENCES.DURATION': '<b>Čas</b>: {{duration}}',
        'PRESENCES.OUTINGS': 'Výstupy',
        'PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION': 'Denní doba spánku',
        'PRESENCES_AND_SLEEPS.DURATION': 'Doba trvání: <b>{{duration}}</b>',
        'PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT': 'Páky Nokturna name: <b>{{number}}</b>',
        'PRESENCES_AND_SLEEPS.PRESENCES': 'Prezence',
        'PRESENCES_AND_SLEEPS.SLEEP': 'Spát',
        'SLEEPS.HEADER': '{{date}}',
        'SLEEPS.SLEEP_DURATION': 'Doba spánku <b>{{duration}}</b>',
        'SLEEPS.SLEEPS_DAILY_AVERAGES': 'Průměrná {{day}}: <b>{{duration}}</b>',
        'SLEEPS_LEGACY.DIDNT_WAKE_UP_OVERNIGHT': 'Žádný ze dne na den',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_MANY_TIMES': 'Vstal {{number}} pětkrát',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_ONE_TIME': 'Vstal {{number}} pětkrát'
      },
      // --------------------
      // Finnish
      // --------------------
      fi: {
        'GLOBAL.BEDTIME': 'Makaa aika: <b>{{time}}</b>',
        'GLOBAL.NO_DATA': 'Ei ole tietoja kyseisenä ajanjaksona.',
        'GLOBAL.WAKE_UP_TIME': 'Wake Aika: <b>{{time}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_MANY_MOVES': '{{room}} <b>{{number}} liikkeitä</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_ONE_MOVE': '{{room}} <b>{{number}} liikkeen</b>',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_MANY_MOVES': '{{date}} - {{number}} yhteensä liikkeet',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_ONE_MOVE': '{{date}} - {{number}} liikkeen Yhteensä',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_MANY_MOVES': 'Tässä kuussa, vastaanottaja havaittiin {{name}} <b>{{number}}</b> kertaa.',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_ONE_MOVE': 'Tässä kuussa, vastaanottaja havaittiin {{name}} <b>{{number}}</b> kerran.',
        'OUTINGS.OUTING_DETAILS': '<b>Output #{{number}}</b> {{fromTime}} ja {{toTime}}',
        'PRESENCES.BED': 'Sänky ({{room}})',
        'PRESENCES.DOOR': 'Ovi ({{room}})',
        'PRESENCES.DURATION': '<b>Aika</b>: {{duration}}',
        'PRESENCES.OUTINGS': 'Lähdöt',
        'PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION': 'Päivittäinen unen kesto',
        'PRESENCES_AND_SLEEPS.DURATION': 'Kesto: <b>{{duration}}</b>',
        'PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT': 'Yön auringonlaskujen määrä: <b>{{number}}</b>',
        'PRESENCES_AND_SLEEPS.PRESENCES': 'Läsnäolo',
        'PRESENCES_AND_SLEEPS.SLEEP': 'Uni',
        'SLEEPS.HEADER': '{{date}}',
        'SLEEPS.SLEEP_DURATION': 'Unen kesto <b>{{duration}}</b>',
        'SLEEPS.SLEEPS_DAILY_AVERAGES': 'Keskimääräinen {{day}}: <b>{{duration}}</b>',
        'SLEEPS_LEGACY.DIDNT_WAKE_UP_OVERNIGHT': 'Ei yhdessä yössä',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_MANY_TIMES': 'Hän nousi {{number}} kertaa',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_ONE_TIME': 'Hän nousi {{number}} kerran'
      },
      // --------------------
      // German
      // --------------------
      de: {
        'GLOBAL.BEDTIME': 'Liegezeit: <b>{{time}}</b>',
        'GLOBAL.NO_DATA': 'Es gibt keine Daten für den betreffenden Zeitraum.',
        'GLOBAL.WAKE_UP_TIME': 'Wake Time: <b>{{time}}</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_MANY_MOVES': '{{room}} <b>{{number}} Bewegungen</b>',
        'MOVES_PER_ROOM.TOOLTIP_DESCRIPTION_ONE_MOVE': '{{room}} <b>{{number}} Bewegung</b>',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_MANY_MOVES': '{{date}} - {{number}} Gesamtbewegungen',
        'MOVES_PER_ROOM.TOOLTIP_HEADER_ONE_MOVE': '{{date}} - {{number}} Bewegung Gesamt',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_MANY_MOVES': 'In diesem Monat wurde der Empfänger {{name}} erkannt <b>{{number}}</b> einmal.',
        'MOVES_PER_ROOM.TOOLTIP_SUMMARY_ONE_MOVE': 'In diesem Monat wurde der Empfänger {{name}} erkannt <b>{{number}}</b> einmal.',
        'OUTINGS.OUTING_DETAILS': '<b>Ausgabe #{{number}}</b> von {{fromTime}} zu {{toTime}}',
        'PRESENCES.BED': 'Bett ({{room}})',
        'PRESENCES.DOOR': 'Tür ({{room}})',
        'PRESENCES.DURATION': '<b>Zeit</b>: {{duration}}',
        'PRESENCES.OUTINGS': 'Ausgänge',
        'PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION': 'Tägliche Schlafdauer',
        'PRESENCES_AND_SLEEPS.DURATION': 'Dauer: <b>{{duration}}</b>',
        'PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT': 'Anzahl der nächtlichen Sonnenaufgänge: <b>{{number}}</b>',
        'PRESENCES_AND_SLEEPS.PRESENCES': 'Teilnahme',
        'PRESENCES_AND_SLEEPS.SLEEP': 'Schlaf',
        'SLEEPS.HEADER': 'die {{date}}',
        'SLEEPS.SLEEP_DURATION': 'Schlafdauer <b>{{duration}}</b>',
        'SLEEPS.SLEEPS_DAILY_AVERAGES': 'Durchschnittliche {{day}}: <b>{{duration}}</b>',
        'SLEEPS_LEGACY.DIDNT_WAKE_UP_OVERNIGHT': 'Es fehlen über Nacht',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_MANY_TIMES': 'Er stand {{number}} mal auf',
        'SLEEPS_LEGACY.WOKE_UP_OVERNIGHT_ONE_TIME': 'Er stand {{number}} mal auf'
      }
    };

    this.setLanguage('fr');
  }

  translate(str, params) {
    let result = this._strings[this.language][str];

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        result = result.split(`{{${key}}}`).join(value);
      });
    }

    return result;
  }

  setLanguage(language) {
    if (!this._validateLanguage(language)) {
      this.language = 'fr';
    } else {
      this.language = language;
    }

    moment.locale(this.language);
  }

  _validateLanguage(language) {
    return ['fr', 'en', 'zh', 'es', 'sk', 'cs', 'fi', 'de'].includes(language);
  }
}
