import { WidgetBackgroundSetting } from "./static-data";

export const widgetPossitionSetting = {
  "portrait.default.device.width": 375,
  "portrait.default.device.height": 667,

  "portrait.default.height": 140,
  "portrait.default.minHeight": 100,
  "portrait.default.xpos": 1,
  "portrait.default.ypos": 1,

  "portrait.default.iframily.widget.height": 550,
  "portrait.default.iframily.widget.width": 250,
  "portrait.default.iframily.widget.xpos": 150,
  "portrait.default.iframily.widget.ypos": 100,
  "portrait.default.iframily.widget.minheight": 65,
  "portrait.default.iframily.widget.minwidth": 117,

  "portrait.default.video.widget.xpos": 1,
  "portrait.default.video.widget.ypos": 1,

  "portrait.default.google_map.widget.xpos": 1,
  "portrait.default.google_map.widget.ypos": 1,

  "portrait.default.asana.widget.xpos": 1,
  "portrait.default.asana.widget.ypos": 1,

  "portrait.default.trello.widget.xpos": 1,
  "portrait.default.trello.widget.ypos": 1,

  "portrait.default.google_doc.widget.xpos": 1,
  "portrait.default.google_doc.widget.ypos": 1,

  "portrait.default.microsoft_office_doc.widget.xpos": 1,
  "portrait.default.microsoft_office_doc.widget.ypos": 1,

  "portrait.default.airtable.widget.xpos": 1,
  "portrait.default.airtable.widget.ypos": 1,

  "portrait.default.graph.widget.height": 140,
  "portrait.default.graph.widget.width": 375,
  "portrait.default.graph.widget.xpos": 1,
  "portrait.default.graph.widget.ypos": 1,
  "portrait.default.graph.widget.minHeight": 130,
  "portrait.default.graph.widget.minwidth": 117,

  // "portrait.default.clock.widget.width": 375,
  // "portrait.default.clock.widget.xpos": 1,
  // "portrait.default.clock.widget.ypos": 1,
  // "portrait.default.clock.widget.minwidth": 117,

  "portrait.default.clock.widget.height": 200,
  "portrait.default.clock.widget.width": 100,
  "portrait.default.clock.widget.xpos": 130,
  "portrait.default.clock.widget.ypos": 50,
  "portrait.default.clock.minheight": 60,
  "portrait.default.clock.minwidth": 117,

  "portrait.default.calendar.widget.height": 550,
  "portrait.default.calendar.widget.width": 250,
  "portrait.default.calendar.widget.xpos": 150,
  "portrait.default.calendar.widget.ypos": 100,
  "portrait.default.calendar.widget.minheight": 65,
  "portrait.default.calendar.widget.minwidth": 117,

  "portrait.default.mealplan.widget.height": 550,
  "portrait.default.mealplan.widget.width": 250,
  "portrait.default.mealplan.widget.xpos": 150,
  "portrait.default.mealplan.widget.ypos": 100,
  "portrait.default.mealplan.widget.minheight": 65,
  "portrait.default.mealplan.widget.minwidth": 117,

  "portrait.default.todo.widget.height": 550,
  "portrait.default.todo.widget.width": 250,
  "portrait.default.todo.widget.xpos": 150,
  "portrait.default.todo.widget.ypos": 100,
  "portrait.default.todo.widget.minheight": 65,
  "portrait.default.todo.widget.minwidth": 117,

  "portrait.default.chores.widget.height": 550,
  "portrait.default.chores.widget.width": 250,
  "portrait.default.chores.widget.xpos": 150,
  "portrait.default.chores.widget.ypos": 100,
  "portrait.default.chores.widget.minheight": 65,
  "portrait.default.chores.widget.minwidth": 117,

  "portrait.default.image.widget.height": 440,
  "portrait.default.image.widget.width": 200,
  "portrait.default.image.widget.xpos": 150,
  "portrait.default.image.widget.ypos": 50,
  "portrait.default.image.widget.minheight": 65,
  "portrait.default.image.widget.minwidth": 100,

  "portrait.default.gif.widget.height": 440,
  "portrait.default.gif.widget.width": 200,
  "portrait.default.gif.widget.xpos": 150,
  "portrait.default.gif.widget.ypos": 50,
  "portrait.default.gif.widget.minheight": 65,
  "portrait.default.gif.widget.minwidth": 100,

  "portrait.default.health.widget.height": 100,
  "portrait.default.health.widget.width": 275,
  "portrait.default.health.widget.xpos": 3,
  "portrait.default.health.widget.ypos": 278,
  "portrait.default.health.widget.minheight": 100,
  "portrait.default.health.widget.minwidth": 117,

  "portrait.default.weather.widget.height": 170,
  "portrait.default.weather.widget.width": 130,
  "portrait.default.weather.widget.xpos": 80,
  "portrait.default.weather.widget.ypos": 200,
  "portrait.default.weather.minheight": 65,
  "portrait.default.weather.minwidth": 117,

  "portrait.default.quotes.widget.height": 180,
  "portrait.default.quotes.widget.width": 180,
  "portrait.default.quotes.widget.xpos": 100,
  "portrait.default.quotes.widget.ypos": 100,
  "portrait.default.quotes.widget.minheight": 65,
  "portrait.default.quotes.widget.minwidth": 117,

  "portrait.default.stickynotes.widget.height": 130,
  "portrait.default.stickynotes.widget.width": 150,
  "portrait.default.stickynotes.widget.xpos": 50,
  "portrait.default.stickynotes.widget.ypos": 100,
  "portrait.default.stickynotes.widget.minheight": 65,
  "portrait.default.stickynotes.widget.minwidth": 117,

  "portrait.default.count_down.widget.height": 120,
  "portrait.default.count_down.widget.width": 100,
  "portrait.default.count_down.widget.xpos": 50,
  "portrait.default.count_down.widget.ypos": 65,
  "portrait.default.count_down.widget.minheight": 65,
  "portrait.default.count_down.widget.minwidth": 100,
};

export const newWidgetSetting = {
  backgroundSetting: WidgetBackgroundSetting,
  status: "on",
  goalPriority: "stay_up",
  viewType: "",
  xPos: 1,
  yPos: 5,
  width: 195,
  height: 140,
  deviceWidth: 375,
  deviceHeight: 667,
  minHeight: 100,
  minWidth: 100,
  pinned: false,
  widget: {
    id: 0,
    type: "",
    masterCategory: "",
    displayName: "",
  },
};
