import React, {useEffect, useState} from 'react';

import {convertFileSrc} from "@tauri-apps/api/tauri";
import {appWindow, LogicalSize} from "@tauri-apps/api/window";
import {
    executeSearchResult,
    FeatureProps,
    goToStep,
    PluginSearchResult,
    receiveSearchResults, updateSearchResults,
    updateSteps
} from "../models/models";
import {windowHeight, windowWidth} from "../services";

interface Step {
    name: string,
    id: string
}

export default (props: FeatureProps) => {
    const [searchString, setSearchString] = useState<string>("");
    const [steps, setSteps] = useState<Step[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [searchResults, setSearchResults] = useState<PluginSearchResult[]>([]);

    const handleKeyIndput = async (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown':
                if (activeIndex < searchResults.length)
                    setActiveIndex(activeIndex + 1);
                break;
            case 'ArrowUp':
                if (activeIndex > 0)
                    setActiveIndex(activeIndex - 1);
                break;
            case 'Escape':
                await hideSearchWindow();
        }


        if(searchResults.length > 0){
            for (const action of searchResults[activeIndex].searchResult.actions) {
                if (event.key === action.id) {
                    await props.connection.invoke(executeSearchResult, searchResults[activeIndex].commandId, action.id)
                    UpdateSearchString("")
                    break;
                }
            }
        }
    }

    const hideSearchWindow = async () => {
        if (!await appWindow.isVisible())
            return;
        await appWindow.hide()
        UpdateSearchString("");

        await props.connection.send(goToStep, steps[0].id)
        UpdateSteps([steps[0]])
    }

    useEffect(() => {
        props.connection.on(receiveSearchResults, (searchString: string, commands: PluginSearchResult[]) => {
            const firstNCommands = commands.slice(0, 8);
            firstNCommands.forEach((x) => {
                if (x.searchResult.icon === "" || x.searchResult.webIcon !== undefined)
                    return;
                x.searchResult.webIcon = convertFileSrc(x.searchResult.icon);
            })
            UpdateSearchResults(firstNCommands);
        });

        props.connection.on(updateSteps, (steps: Step[]) => {
            UpdateSteps(steps);
        });
        props.connection.invoke<Step[]>(updateSteps).then();

        let unlistenFn: () => void;
        appWindow.listen('tauri://blur', ({
                                              event,
                                              payload
                                          }) => hideSearchWindow()).then((x: () => void) => unlistenFn = x);
        return () => {
            unlistenFn();
        };
    }, []);

    function UpdateSearchResults(newResults: PluginSearchResult[]) {
        setSearchResults(newResults);
        appWindow.setSize(new LogicalSize(windowWidth, windowHeight + 50 * newResults.length)).then();
    }

    function UpdateSearchString(newString: string) {
        setSearchString(newString);
        props.connection.send(updateSearchResults, newString).then();
        setActiveIndex(0);
    }

    function UpdateSteps(newSteps: Step[]) {
        console.log(newSteps)
        setSteps(newSteps);
    }

    useEffect(() => {
        console.log("rerendering")
    })

    return (
        <>
            <div className="w-full h-[60px] text-userInputText flex bg-userInputBackground items-center overflow-hidden"
                 data-tauri-drag-region>
                <svg className="fill-userInputText w-[28px] h-[28px] m-[16px]" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 32 32" version="1.1" data-tauri-drag-region>
                    <g id="surface1">
                        <path
                            d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z "></path>
                    </g>
                </svg>
                <input
                    className="appearance-none focus:outline-none w-full h-full bg-userInputBackground text-[24px] font-[200] overflow-hidden"
                    type="text" data-tauri-drag-region
                    value={searchString}
                    onChange={(e: any) => UpdateSearchString(e.target.value)}
                    autoFocus
                    onKeyDown={handleKeyIndput}

                />
            </div>
            <div className={"w-full h-[30px] flex bg-userInputBackground gap-[5px]"}>
                <div className={"w-0"}></div>
                {steps.map((step: Step) =>
                    <div className={"h-[25px] bg-searchResultActiveBackground text-searchResultNameText px-1 rounded"}>
                        {step.name}
                    </div>
                )}
            </div>
            {searchResults.map((pluginCommand: PluginSearchResult, index: number) =>
                <div key={pluginCommand.commandId}
                     className={`w-full h-[50px] text-userInputText ${index == activeIndex ? 'bg-searchResultActiveBackground' : 'bg-searchResultBackground'} items-center flex`}>
                    <div className="w-[60px] h-full flex items-center justify-center">
                        <img src={pluginCommand.searchResult.webIcon} alt=""/>
                    </div>
                    <div>
                        <p className="text-[17px] text-searchResultNameText">{pluginCommand.searchResult.title}</p>
                        <p className="text-[12px] text-searchResultDescriptionText whitespace-nowrap">{pluginCommand.searchResult.description}</p>
                    </div>
                </div>
            )}

        </>
    );
}
