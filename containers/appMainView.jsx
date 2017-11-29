/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MemoryLayout from '../components/MemoryLayout';

const AppMainView = (
    props => {
        const { loaded, target } = props;

        let targetMap;
        if (!target.serialNumber) {
            targetMap = (
                <div style={{
                    position: 'absolute',
                    top: 'calc(50% - 50px)',
                }}
                >Connect to a DevKit to see the contents of its non-volatile memory here.</div>
            );
        } else if (target.serialNumber && target.isReady) {
            const targetData = {
                memMaps: new Map([['', target.memMap]]),
                fileError: loaded.fileError,
                fileColours: new Map([['', '#C0C0C0']]),
                writtenAddress: 0,
                labels: target.labels,
                regions: target.regions,
            };

            targetMap = <MemoryLayout {...targetData} targetSize={target.size} />;
        } else {
            targetMap = <div className="memlayout-spinner" />;
        }


        return (
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '50%',
                }}
                >
                    {targetMap}
                </div>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: '50%',
                }}
                >
                    <MemoryLayout {...loaded} targetSize={target.size} />
                </div>
            </div>
        );
    }
);

AppMainView.propTypes = {
    loaded: PropTypes.shape({}).isRequired,
    target: PropTypes.shape({}).isRequired,
};

export default connect(
    (state, props) => ({
        ...props,
        loaded: state.app.file.loaded,
        target: state.app.target,
    }),
)(AppMainView);