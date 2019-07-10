/*******************************************************************************
* Copyright (c) 2019 IBM Corporation and others.
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v2.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v20.html
*
* Contributors:
*     IBM Corporation - initial API and implementation
*******************************************************************************/

import { FileWatcher } from "./FileWatcher";
import * as log from "./Logger";

export class DebugTimer {

    private readonly _parent: FileWatcher;

    private _timer: NodeJS.Timer;

    constructor(parent: FileWatcher) {
        this._parent = parent;

        const debugTimer = this;

        this.schedule();
    }

    private tick() {

        let renew = true;

        try {

            const debugStr = this._parent.generateDebugString();
            if (!debugStr || debugStr.trim().length === 0) {
                // Filewatcher is disposed.
                renew = false;
                return;
            }

            for (const str of debugStr.split("\n"))  {
                log.info("[status] " + str);
            }

        } finally {
            if (renew) {
                this.schedule();
            }
        }

    }

    private schedule() {
        const debugTimer = this;
        this._timer = setTimeout(() => {
            debugTimer.tick();
        }, 30 * 60 * 1000);

    }
}