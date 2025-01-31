import GeneralInfoTab from "./components/tabs/GeneralInfoTab";
import ElevationTab from "./components/tabs/ElevationTab";
import SpeedTab from "./components/tabs/SpeedTab";
import React from "react";
import {Tab} from "@mui/material";
import PointsTab from "./components/tabs/PointsTab";
import SettingsTab from "./components/tabs/SettingsTab";
import WaypointsTab from "./components/tabs/WaypointsTab";

export default class TrackTabList {

    state = {
        tabs: null,
        tabList: [],
        defaultTab: 'general',
        graphWidth: 600
    };

    create(ctx, setShowContextMenu) {
        let tabs = {};
        let list = [];

        const hasAltitude = ctx.selectedGpxFile?.analysis?.hasElevationData;
        const hasSpeed = ctx.selectedGpxFile?.analysis?.hasSpeedData;

        let isTrack = ctx.currentObjectType === ctx.OBJECT_TYPE_CLOUD_TRACK
            || ctx.currentObjectType === ctx.OBJECT_TYPE_LOCAL_CLIENT_TRACK;

        tabs.Info = <GeneralInfoTab key='general' width={this.state.graphWidth} srtm={false} setShowContextMenu={setShowContextMenu}/>;
        if (ctx.currentObjectType !== ctx.OBJECT_TYPE_CLOUD_TRACK && ctx.selectedGpxFile?.tracks?.length > 0) {
            tabs.Track = <PointsTab key='points' width={this.state.graphWidth}/>;
        }

        if (isTrack && ctx.selectedGpxFile?.wpts?.length > 0) {
            tabs.Waypoints = <WaypointsTab key='waypoints' width={this.state.graphWidth}/>;
        }

        if (ctx.currentObjectType !== ctx.OBJECT_TYPE_CLOUD_TRACK) {
            tabs.Settings = <SettingsTab key='settings' width={this.state.graphWidth}/>;
        }

        if (hasAltitude) {
            tabs.Elevation = <ElevationTab key='elevation' width={this.state.graphWidth} srtm={false}/>
        }

        if (hasSpeed) {
            tabs.Speed = <SpeedTab key='speed' width={this.state.graphWidth}/>;
        }

        if (ctx.selectedGpxFile?.analysis && ctx.selectedGpxFile.analysis.srtmAnalysis) {
            tabs.SRTM = <GeneralInfoTab key='srtm'
                                        width={this.state.graphWidth} srtm={true}/>;
            tabs["SRTM Ele"] = <ElevationTab key='srtmele' width={this.state.graphWidth} srtm={true}/>
        }

        list = list.concat(Object.keys(tabs).map((item, index) =>
            <Tab value={tabs[item].key + ''} label={item} key={'tab:' + item}/>));

        this.state.tabList = list;
        this.state.tabs = tabs;

        return this.state;
    }
}