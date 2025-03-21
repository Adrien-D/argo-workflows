import * as kubernetes from 'argo-ui/src/models/kubernetes';
import * as React from 'react';

import {Timestamp} from '../shared/components/timestamp';
import {ConditionsPanel} from '../shared/conditions-panel';
import {CronWorkflowSpec, CronWorkflowStatus} from '../shared/models';
import {TIMESTAMP_KEYS} from '../shared/use-timestamp';
import {WorkflowLink} from '../workflows/components/workflow-link';
import {PrettySchedule} from './pretty-schedule';

export function CronWorkflowStatusViewer({spec, status}: {spec: CronWorkflowSpec; status: CronWorkflowStatus}) {
    if (status === null) {
        return null;
    }
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                {[
                    {title: 'Active', value: status.active ? getCronWorkflowActiveWorkflowList(status.active) : <i>No Workflows Active</i>},
                    {
                        title: 'Schedules',
                        value: spec.schedules.map(schedule => (
                            <>
                                <code>{schedule}</code> <PrettySchedule schedule={schedule} />
                                <br />
                            </>
                        ))
                    },
                    {title: 'Last Scheduled Time', value: <Timestamp date={status.lastScheduledTime} timestampKey={TIMESTAMP_KEYS.CRON_WORKFLOW_STATUS_LAST_SCHEDULED} />},
                    {title: 'Conditions', value: <ConditionsPanel conditions={status.conditions} />}
                ].map(attr => (
                    <div className='row white-box__details-row' key={attr.title}>
                        <div className='columns small-3'>{attr.title}</div>
                        <div className='columns small-9'>{attr.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getCronWorkflowActiveWorkflowList(active: kubernetes.ObjectReference[]) {
    return active.reverse().map(activeWf => <WorkflowLink key={activeWf.uid} namespace={activeWf.namespace} name={activeWf.name} />);
}
