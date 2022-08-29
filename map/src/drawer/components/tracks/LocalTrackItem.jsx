import React, {useContext, useState} from "react";
import AppContext from "../../../context/AppContext";
import {ListItemText, MenuItem, Switch, Tooltip, Typography} from "@mui/material";
import TracksManager from "../../../context/TracksManager";
import GPXCreator from "../../../util/GPXCreator";

export default function LocalTrackItem({track, index}) {

    const ctx = useContext(AppContext);
    const [indexTrack, setIndexTrack] = useState(index);

    function enableLayer(visible) {
        if (!visible) {
            deleteTrackFromMap();
        } else {
            addTrackToMap();
        }
        TracksManager.saveTracks(ctx.localTracks);
    }

    function addGpx(track, selectedTrack) {
        if (!selectedTrack.gpx) {
            selectedTrack.gpx = GPXCreator.createGpx(track);
            ctx.setLocalTracks([
                ...ctx.localTracks.slice(0, indexTrack),
                selectedTrack,
                ...ctx.localTracks.slice(indexTrack + 1, ctx.localTracks.length)
            ]);
        }
    }

    function cleanSelectedTrackIfNeed(currentTrack) {
        if (ctx.selectedGpxFile && ctx.selectedGpxFile.name === currentTrack.name) {
            ctx.setSelectedGpxFile(null);
        }
    }

    function deleteTrackFromMap() {
        let currentTrack = ctx.localTracks[track.index];
        ctx.setCurrentObjectType(null);
        currentTrack.selected = false;
        cleanSelectedTrackIfNeed(currentTrack);
        ctx.setLocalTracks([...ctx.localTracks]);
    }

    function addTrackToMap() {
        ctx.setCurrentObjectType('local_client_track');
        if (indexTrack !== undefined) {
            let selectedTrack = ctx.localTracks[indexTrack];
            track.index = indexTrack;
            setIndexTrack(indexTrack);
            selectedTrack.selected = true;
            if (!selectedTrack.gpx) {
                addGpx(track, selectedTrack);
            } else {
                ctx.setLocalTracks([...ctx.localTracks]);
            }
        }
        ctx.setSelectedGpxFile(Object.assign({}, track));
    }

    return <div>
        <MenuItem key={'track._leaflet_id' + indexTrack} onClick={() => addTrackToMap()}>
            <Tooltip title={<div>
                {track.name}
            </div>}>
                <ListItemText inset>
                    <Typography variant="inherit" noWrap>
                        {track.name}
                    </Typography>
                </ListItemText>
            </Tooltip>
            <Switch checked={track.selected === true}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        enableLayer(e.target.checked)
                    }}/>
        </MenuItem>
    </div>
}