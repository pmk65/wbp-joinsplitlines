// Global vars
var lbDelimiter,
		edDelimiter,
		cbTrim,
		cbDelEmpty,
		cbEnclose,
		cbMode,
		lbPosition,
		edPosition,
		btnOk,
		btnCancel;

/**
 * Display Modalbox for Join action
 *
 * @return void
 */
function ShowJoinLines() {
		if (Editor.SelText == "") {
			alert("No lines selected!");
			return;
		}
		CreateJoinModal();
	  var modalResult = modalForm.ShowModal;
		if (modalResult == mrOK) JoinLines();
		delete modalForm; // Remove Modal object
}

/**
 * Display Modalbox for Split action
 *
 * @return void
 */
function ShowSplitLine() {
		if (Editor.SelText == "") {
			alert("No line(s) selected!");
			return;
		}
		CreateSplitModal();
	  var modalResult = modalForm.ShowModal;
		if (modalResult == mrOK) SplitLine();
		delete modalForm; // Remove Modal object
}

/**
 * Join lines action
 *
 * @return void
 */
function JoinLines() {
	var userSelection = Editor.Selection,
			startLine = userSelection.SelStartLine,
			endLine = userSelection.SelEndLine,
			selection = Editor.SelText,
			currentLine,
			res = "";

	for (var i=startLine; i <= endLine; i++) {
		currentLine = Editor.LinesAsDisplayed[i];
		if (cbTrim.Checked == true) currentLine = Trim(currentLine);
		if ((cbDelEmpty.Checked == true) && (Length(currentLine) == 0)) Continue;
		switch (cbEnclose.Text) {
			case "Single quoutes": {
				currentLine = "'" + Replace(currentLine,"'", "\\\'") + "'";
			}
			case "Double quoutes": {
				currentLine = "\"" + Replace(currentLine,"\"", "\\\"") + "\"";
			}
		}
		res += currentLine + edDelimiter.Text;
	}
	// Update editor selection
	Editor.Selection.SelStartCol = 0;
	Editor.Selection.SelEndCol = 0;
 	Editor.SelText = Copy(res,1,(Length(res) - Length(edDelimiter.Text)));
}

/**
 * Split line action
 *
 * @return void
 */
function SplitLine() {
	var t = Editor.SelText,
			l = Length(t),
			res = "";

	switch (cbMode.Text) {
		case "Delimiter": {
			res = Replace(Replace(t, "\n", ""), edDelimiter.Text, "\n");
		}
		case "Position": {
			var p = edPosition.Text;
			if (p != "") {
				p = StrToInt(p);
				while (l > p) {
					res += Copy(t, 1, p) + "\n";
					DeleteStr(t, 1, p);
					l = Length(t);
				}
				if (Length(t) > 0) {
					res += t;
				}
			}
			else res = t;
		}
		default: res = Editor.SelText;
	}
	// Update editor selection
	Editor.Selection.SelStartCol = 0;
	Editor.Selection.SelEndCol = 0;
 	Editor.SelText = res;
}

/**
 *
 * Create the Modal GUI Form for Join action
 *
 * @return      void
 *
 */
function CreateJoinModal() {
  var mleft = 16,
			mtop = 16,
			lspace = 6,
			vspace = 26;

  modalForm = new TForm(WeBuilder);
  modalForm.Width = 200;
  modalForm.Height = 200;
  modalForm.Position = poScreenCenter;
  modalForm.BorderStyle = bsSingle; //disable dialog resizing
  modalForm.BorderIcons = biSystemMenu; //remove maximize & minimize buttons
  modalForm.Caption = "Join Lines";

	// 1st line of controls

	// Delimiter label object
  lbDelimiter = new TLabel(modalForm);
  lbDelimiter.Parent = modalForm;
  lbDelimiter.Caption = "Delimiter:";
  lbDelimiter.SetBounds(mleft, mtop + (vspace*0), 56, 15);
	lbDelimiter.Hint = "Optional delimiter character(s)";
	lbDelimiter.ShowHint = true;

	// Delimiter input object
  edDelimiter = new TEdit(modalForm);
  edDelimiter.Parent = modalForm;
  edDelimiter.SetBounds(mleft + lspace + 56, mtop - 2 + (vspace*0), 70, 15);
	edDelimiter.Hint = "Optional delimiter character(s)";
	edDelimiter.ShowHint = true;

		// 2nd line of controls

	// Trim lines checkbox object
	cbTrim = new TCheckBox(modalForm);
  cbTrim.Parent = modalForm;
  cbTrim.Caption = "Trim spaces and tabs?";
	cbTrim.Checked = true;
  cbTrim.SetBounds(mleft, mtop + (vspace*1), 160, 15);
	cbTrim.Hint = "If checked, spaces and tabs wil be removed from start and end of line";
	cbTrim.ShowHint = true;

	// 3nd line of controls

	// Remove empty lines checkbox object
	cbDelEmpty = new TCheckBox(modalForm);
  cbDelEmpty.Parent = modalForm;
  cbDelEmpty.Caption = "Remove empty lines?";
	cbDelEmpty.Checked = true;
  cbDelEmpty.SetBounds(mleft, mtop + (vspace*2), 140, 15);
	cbDelEmpty.Hint = "If checked, empty lines will be removed";
	cbDelEmpty.ShowHint = true;

	// 4rd line of controls

	// Enclose in label object
  var lbEnclose = new TLabel(modalForm);
  lbEnclose.Parent = modalForm;
  lbEnclose.Caption = "Enclose in:";
  lbEnclose.SetBounds(mleft, mtop + (vspace*3), 62, 15);
	lbEnclose.Hint = "Choose if you want the lines enclosed in quotes";
	lbEnclose.ShowHint = true;

   // Enclose in combobox object
  cbEnclose = new TComboBox(modalForm);
  cbEnclose.Parent = modalForm;
  cbEnclose.Items.Add("");
  cbEnclose.Items.Add("Single quoutes");
  cbEnclose.Items.Add("Double quoutes");
  cbEnclose.ItemIndex = 0;
	cbEnclose.Style = csOwnerDrawFixed; // If set to csDropDown (default value) then keyboard entry is possible
  cbEnclose.SetBounds(mleft + 62 + lspace, mtop-3 + (vspace*3), 95, 21);
	cbEnclose.Hint = "Choose if you want the lines enclosed in quotes";
	cbEnclose.ShowHint = true;

	// 5th line of controls

	// OK button object
  btnOk = new TButton(modalForm);
  btnOK.Parent = modalForm;
  btnOk.Caption = "OK";
  btnOk.Default = True;
  btnOK.ModalResult = mrOK;
  btnOk.SetBounds(mleft, mtop  + 5 + (vspace*4), 75, 25);

	// Cancel button object
  btnCancel = new TButton(modalForm);
  btnCancel.Parent = modalForm;
  btnCancel.Caption = "Cancel";
  btnCancel.Cancel = True;
  btnCancel.ModalResult = mrCancel;
  btnCancel.SetBounds(modalForm.Width - 75 - mleft -5 , mtop  + 5 + (vspace*4), 75, 25);
}

/**
 *
 * Create the Modal GUI Form for Split action
 *
 * @return      void
 *
 */
function CreateSplitModal() {
  var mleft = 16,
			mtop = 16,
			lspace = 6,
			vspace = 26;

  modalForm = new TForm(WeBuilder);
  modalForm.Width = 194;
  modalForm.Height = 150;
  modalForm.Position = poScreenCenter;
  modalForm.BorderStyle = bsSingle; //disable dialog resizing
  modalForm.BorderIcons = biSystemMenu; //remove maximize & minimize buttons
  modalForm.Caption = "Split Line";

	// 1st line of controls

	// Mode label object
  var lbMode = new TLabel(modalForm);
  lbMode.Parent = modalForm;
  lbMode.Caption = "Split at:";
  lbMode.SetBounds(mleft, mtop, 60, 15);
	lbMode.Hint = "Choose method of splitting";
	lbMode.ShowHint = true;

	// Mode combobox object
  cbMode = new TComboBox(modalForm);
  cbMode.Parent = modalForm;
  cbMode.Items.Add("Delimiter");
  cbMode.Items.Add("Position");
  cbMode.ItemIndex = 0;
	cbMode.Style = csOwnerDrawFixed; // If set to csDropDown (default value) then keyboard entry is possible
	cbMode.OnChange = "ChangeMode";
  cbMode.SetBounds(mleft + 60 + lspace, mtop-3, 90, 21);
	cbMode.Hint = "Choose method of splitting";
	cbMode.ShowHint = true;

	// 2nd line of controls

	// Delimiter label object
  lbDelimiter = new TLabel(modalForm);
  lbDelimiter.Parent = modalForm;
  lbDelimiter.Caption = "Delimiter:";
  lbDelimiter.SetBounds(mleft, mtop + (vspace*1), 60, 15);
	lbDelimiter.Hint = "Delimiter/Split character(s)";
	lbDelimiter.ShowHint = true;

	// Delimiter input object
  edDelimiter = new TEdit(modalForm);
  edDelimiter.Parent = modalForm;
  edDelimiter.SetBounds(mleft + lspace + 60, mtop - 2 + (vspace*1), 90, 15);
	edDelimiter.Hint = "Delimiter/Split character(s)";
	edDelimiter.ShowHint = true;

	// Position label object
  lbPosition = new TLabel(modalForm);
  lbPosition.Parent = modalForm;
  lbPosition.Caption = "Position:";
	lbPosition.Visible = false;
  lbPosition.SetBounds(mleft, mtop + (vspace*1), 60, 15);
	lbPosition.Hint = "nth position to split at";
	lbPosition.ShowHint = true;

	// Position input object
  edPosition = new TEdit(modalForm);
  edPosition.Parent = modalForm;
	edPosition.Visible = false;
	edPosition.OnKeyPress = "NumbersOnly";
  edPosition.SetBounds(mleft + lspace + 60, mtop + (vspace*1) -2 , 90, 15);
	edPosition.Hint = "nth position to split at";
	edPosition.ShowHint = true;

	// 3rd line of controls

	// OK button object
  btnOk = new TButton(modalForm);
  btnOK.Parent = modalForm;
  btnOk.Caption = "OK";
  btnOk.Default = True;
  btnOK.ModalResult = mrOK;
  btnOk.SetBounds(mleft, mtop + 5 + (vspace*2), 75, 25);

	// Cancel button object
  btnCancel = new TButton(modalForm);
  btnCancel.Parent = modalForm;
  btnCancel.Caption = "Cancel";
  btnCancel.Cancel = True;
  btnCancel.ModalResult = mrCancel;
  btnCancel.SetBounds(modalForm.Width - 75 - mleft -5 , mtop + 5 + (vspace*2), 75, 25);
}

/**
 *
 * OnKeyPress event handler
 * Prevent entry of chars other than numbers
 * Setting key to chr(0) prevents the char from being entered
 *
 * @param     object  Sender: The parent object
 * @param     string  key: The character key pressed
 * @return    void
 *
 */
function NumbersOnly(Sender, key) {
	if (key != RegexMatch(key, "[\\x00\\x08\\x09\\x0D\\x1B\\d]", true)) key = chr(0);
}

/**
 *
 * OnChange event handler
 * Toggles between Delimiter and Position mode
 *
 * @param     object  Sender: The parent object
 * @return    void
 *
 */
function ChangeMode(Sender) {
	var res = true;
	if ( cbMode.Text == "Delimiter") res = false;
	lbDelimiter.Visible = !res;
	edDelimiter.Visible = !res;
	lbPosition.Visible = res;
	edPosition.Visible = res;
}

/**
 * Show info when plugin is installed
 *
 * @return void
 */
function OnInstalled() {
  alert("Join/Split Lines 1.01 by Peter Klein installed sucessfully!");
}

Script.ConnectSignal("installed", "OnInstalled");
var act1 = Script.RegisterDocumentAction("", "Split Line", "", "ShowSplitLine");
var act2 = Script.RegisterDocumentAction("", "Join Lines", "", "ShowJoinLines");

var bmp = new TBitmap;
LoadFileToBitmap(Script.Path + "arrow-split.bmp", bmp);
Actions.SetIcon(act1, bmp);
LoadFileToBitmap(Script.Path + "arrow-join.bmp", bmp);
Actions.SetIcon(act2, bmp);
delete bmp;