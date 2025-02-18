export class CommonWidgetsSettingModel {
    private genericWidgetSettingModelList: Array<GenericWidgetSettingModel>;
	private calendarFlag: boolean;
	private quotesCategories: Array<QuotesCategoryModel>;
	private quotesLength: QuotesLengthModel;
	private healthGoalModel: Array<HealthGoalModel>;
	private bloodGlucoseGoalValueModel: Array<BloodGlucoseGoalValueModel>;
	private userMirrorCalendarList: Array<UserMirrorCalendarModel>;
	private commonStickyNotes = null;
}

export class GenericWidgetSettingModel {
	private widgets: Array<WidgetSettingModel>;
	private mirrorPage: MirrorPageModel;
	private userMirror: UserMirrorModel;
};

export class WidgetSettingModel {
	
};
export class MirrorPageModel {
	
};
export class UserMirrorModel {
	
};
export class QuotesCategoryModel {};
export class QuotesLengthModel {};
export class HealthGoalModel {};
export class BloodGlucoseGoalValueModel {};
export class UserMirrorCalendarModel {};