/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import MemoryMap from 'nrf-intel-hex';

import { Region } from '../util/regions';
import { RootState } from './types';

type Loaded = {
    filename: string;
    loadTime: Date;
    modTime: Date;
    memMap: MemoryMap;
};

export interface FileState {
    detectedRegionNames: Set<string>;
    loaded: Record<string, Loaded>;
    mcubootFilePath?: string;
    memMaps: MemoryMap[];
    mruFiles: string[];
    regions: Region[];
}

const initialState: FileState = {
    detectedRegionNames: new Set<string>(),
    loaded: {},
    mcubootFilePath: undefined,
    memMaps: [],
    mruFiles: [],
    regions: [],
};

interface FileParsePayload {
    memMaps: MemoryMap[];
    loaded: Record<string, Loaded>;
}

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        filesEmpty(state) {
            return {
                ...initialState,
                mruFiles: state.mruFiles,
            };
        },
        fileParse(state, action: PayloadAction<FileParsePayload>) {
            state.memMaps = action.payload.memMaps;
            state.loaded = action.payload.loaded;
        },
        fileRegionsKnown(state, action: PayloadAction<Region[]>) {
            state.regions = action.payload;
        },
        fileRegionNamesKnown(state, action: PayloadAction<Set<string>>) {
            state.detectedRegionNames = action.payload;
        },

        mruFilesLoadSuccess(state, action: PayloadAction<string[]>) {
            state.mruFiles = action.payload || [];
        },

        mcubootFileKnown(state, action: PayloadAction<string | undefined>) {
            state.mcubootFilePath = action.payload;
        },
    },
});

export default fileSlice.reducer;

const {
    filesEmpty,
    fileParse,
    fileRegionsKnown,
    fileRegionNamesKnown,
    mruFilesLoadSuccess,
    mcubootFileKnown,
} = fileSlice.actions;

export const getLoaded = (state: RootState) => state.app.file.loaded;
export const getMruFiles = (state: RootState) => state.app.file.mruFiles;
export const getMcubootFilePath = (state: RootState) =>
    state.app.file.mcubootFilePath;

export {
    filesEmpty,
    fileParse,
    fileRegionsKnown,
    fileRegionNamesKnown,
    mruFilesLoadSuccess,
    mcubootFileKnown,
};
