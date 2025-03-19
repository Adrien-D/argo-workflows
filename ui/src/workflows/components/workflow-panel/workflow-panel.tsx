import {ObjectMeta} from 'argo-ui/src/models/kubernetes';
import * as React from 'react';

import {Notice} from '../../../shared/components/notice';
import {Phase} from '../../../shared/components/phase';
import {WorkflowStatus} from '../../../shared/models';
import {WorkflowDag} from '../workflow-dag/workflow-dag';
import { Input } from 'argo-ui/v2/components';

interface Props {
    workflowMetadata: ObjectMeta;
    workflowStatus: WorkflowStatus;
    selectedNodeId: string;
    nodeClicked: (nodeId: string) => void;
}

const generateNodes = (pattern: string) => {
    let fanInFanOut = pattern.split(',').map((n) => parseInt(n, 10))
  
    fanInFanOut = fanInFanOut.filter((n) => !isNaN(n))
  
    if (fanInFanOut.length === 0) {
      fanInFanOut = []
    }
    const nodes = {
      'node-1-0': {
        id: 'node-1-0',
        name: 'node-1-0',
        displayName: 'node-1-0',
        type: 'DAG',
        templateName: 'whalesay',
        templateScope: 'local/hello-world-nt7x5',
        phase: 'Succeeded',
        boundaryID: 'hello-world-nt7x5',
        startedAt: '2025-03-18T08:53:59Z',
        finishedAt: '2025-03-18T08:54:10Z',
        progress: '1/1',
        resourcesDuration: {
          cpu: 0,
          memory: 1
        },
        nodeFlag: {},
        children: new Array(fanInFanOut[0]).fill(0).map((_, i) => `node--${fanInFanOut[0]}-${i}`)
      }
    }
    let lastIteration = 1
    let prefix = ''
    let nextPrefix = ''
    fanInFanOut.forEach((fanIn, j) => {
      let cursor = 0
      nextPrefix += `${fanIn}-`
      for (let i = 0; i < fanIn * lastIteration; i++) {
        const id = `node-${prefix}-${fanIn}-${i}`
  
        // @ts-expect-error bad tpying
        nodes[id] = {
          id,
          name: id,
          displayName: id,
          type: 'DAG',
          templateName: 'whalesay',
          templateScope: 'local/hello-world-nt7x5',
          phase: 'Succeeded',
          boundaryID: 'hello-world-nt7x5',
          startedAt: '2025-03-18T08:53:59Z',
          finishedAt: '2025-03-18T08:54:10Z',
          progress: '1/1',
          resourcesDuration: {
            cpu: 0,
            memory: 1
          },
          nodeFlag: {},
          children: fanInFanOut[j + 1]
            ? new Array(fanInFanOut[j + 1]).fill(0).map((_) => {
                cursor++
                return `node-${nextPrefix}-${fanInFanOut[j + 1]}-${cursor - 1}`
              })
            : []
        }
      }
      prefix += `${fanIn}-`
      lastIteration = lastIteration * fanIn
    })
  
    return nodes
  }
  
  const generateWorkflow = (pattern: string) => ({
    kind: 'Workflow',
    apiVersion: 'argoproj.io/v1alpha1',
    metadata: {
      name: 'node-1-0',
      generateName: 'hello-world-',
      namespace: 'default',
      uid: 'f9580042-1ac7-479d-bef0-a07d89e9acf0',
      resourceVersion: '3902',
      generation: 5,
      creationTimestamp: '2025-03-18T08:53:59Z',
      deletionTimestamp: '2025-03-18T08:54:20Z',
      deletionGracePeriodSeconds: 0,
      labels: {
        'workflows.argoproj.io/completed': 'true',
        'workflows.argoproj.io/phase': 'Succeeded',
        'workflows.pipekit.io/pipe_uuid': '11111111-1111-1111-1111-111111111111',
        'workflows.pipekit.io/run_uuid': '74676beb-e289-4bb4-a616-d011a835681b',
        'workflows.pipekit.io/runner': 'pipekit-agent-53fe39bc-b163-4d22-8f9e-d9da3dfa0d08'
      },
      annotations: {
        'workflows.argoproj.io/pod-name-format': 'v2'
      }
    },
    spec: {
      templates: [
        {
          name: 'main',
          inputs: {},
          outputs: {},
          metadata: {},
          dag: {
            tasks: [
              {
                name: 'hello-world',
                template: 'whalesay',
                arguments: {
                  parameters: [
                    {
                      name: 'url',
                      value: '{{item.url}}'
                    }
                  ]
                },
                withItems: [
                  {
                    url: 'https://pipekit.io'
                  }
                ]
              }
            ]
          }
        },
        {
          name: 'whalesay',
          inputs: {
            parameters: [
              {
                name: 'url'
              }
            ]
          },
          outputs: {},
          metadata: {},
          container: {
            name: '',
            image: 'ghcr.io/tico24/whalesay',
            command: ['cowsay'],
            args: ['Hello from {{inputs.parameters.url}}'],
            env: [
              {
                name: 'GIT_COMMIT',
                value: '9228b1da06a40b3201dfda590188e51356f878d8'
              },
              {
                name: 'GIT_REPO_NAME',
                value: 'demo-repo'
              },
              {
                name: 'GIT_ORG',
                value: 'pipekit'
              },
              {
                name: 'GIT_BRANCH_NAME',
                value: 'demo-branch'
              },
              {
                name: 'GIT_TARGET_BRANCH',
                value: 'master'
              },
              {
                name: 'GIT_TAG'
              },
              {
                name: 'GIT_SHA',
                value: '9228b1da06a40b3201dfda590188e51356f878d8'
              },
              {
                name: 'GIT_REQUEST_NUMBER',
                value: '2'
              }
            ],
            resources: {}
          }
        }
      ],
      entrypoint: 'main',
      arguments: {},
      serviceAccountName: 'argo',
      nodeSelector: {
        nodegroup: 'spot'
      },
      ttlStrategy: {
        secondsAfterCompletion: 3600
      },
      activeDeadlineSeconds: 3600,
      podGC: {
        strategy: 'OnPodSuccess',
        deleteDelayDuration: '600s'
      },
      volumeClaimGC: {
        strategy: 'OnWorkflowCompletion'
      },
      podMetadata: {
        annotations: {
          'karpenter.sh/do-not-disrupt': 'true'
        },
        labels: {
          'workflows.pipekit.io/pipe_uuid': '11111111-1111-1111-1111-111111111111',
          'workflows.pipekit.io/run_uuid': '74676beb-e289-4bb4-a616-d011a835681b',
          'workflows.pipekit.io/runner': 'pipekit-agent-53fe39bc-b163-4d22-8f9e-d9da3dfa0d08'
        }
      }
    },
    status: {
      phase: 'Succeeded',
      startedAt: '2025-03-18T08:53:59Z',
      finishedAt: '2025-03-18T08:54:10Z',
      progress: '1/1',
      nodes: generateNodes(pattern)
    }
  })

export function WorkflowPanel(props: Props) {
    const [nodes, setNodes] = React.useState('2,3,4')
    const workflow = generateWorkflow(nodes)
    if (!props.workflowStatus.nodes && props.workflowStatus.phase) {
        return (
            <div className='argo-container'>
                <Notice>
                    <Phase value={props.workflowStatus.phase} />: {props.workflowStatus.message}
                </Notice>
            </div>
        );
    }

    return (
        <>

      <div className="my-20 flex flex-row items-center justify-center gap-20">
        <Input onChange={(e) => setNodes(e.target.value)} defaultValue={nodes} />{' '}
        <h4>{`${Object.keys(workflow.status.nodes).length} nodes printed`}</h4>
      </div>
        <WorkflowDag
            workflowName={workflow.metadata.name}
            nodes={workflow.status.nodes}
            artifactRepositoryRef={props.workflowStatus.artifactRepositoryRef}
            selectedNodeId={props.selectedNodeId}
            nodeClicked={props.nodeClicked}
        />
        </>
    );
}
