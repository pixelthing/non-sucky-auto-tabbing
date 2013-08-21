# Non-sucky Input field auto-tabbing

Fields such as sort codes, birth dates and credit card numbers often have scripts attached that automatically tab you between fields as you fill them up.

This is awesome for 50% of people that either have that expectation or don't look at the screen while typing, and a horribly frustrating annoyance for people that are have built muscle memory for using the tab key.

This jquery plugin attempts to please both sets of people.

It starts with "auto-tabbing" enabled by default. But if it detects that you fill in a field then hit tab immediately afterwards, it assumes that you'd prefer to use the tab key, returns your focus to the correct field, turns auto-tabbing off and alerts you that it's done so.

It's designed to work with multiple input groups on the same page, and if you turn off auto-tabbing on one group, it's disabled for all groups.

## One more thing...

This plugin also substitutes certain characters for the tab key, for example if you're typing in a date, hyphened code or IP address, eg typing 28/07/1972 will substitute the "/" for an auto-tab and put each number in the correct box.