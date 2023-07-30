import React, { useContext, useRef, useState } from "react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    PlusCircledIcon,
    DotFilledIcon,
    CheckIcon,
    ChevronRightIcon,
} from '@radix-ui/react-icons';

export const StudentDropdown = () => {
    const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
    const [urlsChecked, setUrlsChecked] = React.useState(false);
    const [person, setPerson] = React.useState('pedro');

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild >
                <button className="IconButton" aria-label="Customise options">
                    <PlusCircledIcon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                    <DropdownMenu.Item className="DropdownMenuItem">
                        Add Note
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="DropdownMenuSeparator" />
                    <DropdownMenu.Label className="DropdownMenuLabel">Book Assessment</DropdownMenu.Label>
                    <DropdownMenu.Item className="DropdownMenuItem">
                        Mark Started
                    </DropdownMenu.Item>

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger" disabled>
                            Set status
                            <div className="RightSlot">
                                <ChevronRightIcon />
                            </div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.SubContent
                                className="DropdownMenuSubContent"
                                sideOffset={2}
                                alignOffset={-5}
                            >
                                <DropdownMenu.Item className="DropdownMenuItem">
                                    Save Page As… <div className="RightSlot">⌘+S</div>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="DropdownMenuItem">Create Shortcut…</DropdownMenu.Item>
                                <DropdownMenu.Item className="DropdownMenuItem">Name Window…</DropdownMenu.Item>
                                <DropdownMenu.Separator className="DropdownMenu.Separator" />
                                <DropdownMenu.Item className="DropdownMenuItem">Developer Tools</DropdownMenu.Item>
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>

                    <DropdownMenu.Separator className="DropdownMenuSeparator" />

                    <DropdownMenu.CheckboxItem
                        className="DropdownMenuCheckboxItem"
                        checked={bookmarksChecked}
                        onCheckedChange={setBookmarksChecked}
                    >
                        <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                            <CheckIcon />
                        </DropdownMenu.ItemIndicator>
                        Show Bookmarks <div className="RightSlot">⌘+B</div>
                    </DropdownMenu.CheckboxItem>
                    <DropdownMenu.CheckboxItem
                        className="DropdownMenuCheckboxItem"
                        checked={urlsChecked}
                        onCheckedChange={setUrlsChecked}
                    >
                        <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                            <CheckIcon />
                        </DropdownMenu.ItemIndicator>
                        Show Full URLs
                    </DropdownMenu.CheckboxItem>

                    <DropdownMenu.Separator className="DropdownMenuSeparator" />

                    <DropdownMenu.Label className="DropdownMenuLabel">People</DropdownMenu.Label>
                    <DropdownMenu.RadioGroup value={person} onValueChange={setPerson}>
                        <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value="pedro">
                            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                <DotFilledIcon />
                            </DropdownMenu.ItemIndicator>
                            Pedro Duarte
                        </DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value="colm">
                            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                <DotFilledIcon />
                            </DropdownMenu.ItemIndicator>
                            Colm Tuite
                        </DropdownMenu.RadioItem>
                    </DropdownMenu.RadioGroup>

                    <DropdownMenu.Arrow className="DropdownMenuArrow" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
