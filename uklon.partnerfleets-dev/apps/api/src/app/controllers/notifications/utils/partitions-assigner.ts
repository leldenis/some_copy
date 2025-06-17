import { Assigner, AssignerProtocol, Cluster, GroupMemberAssignment, GroupState } from 'kafkajs';

export const PartitionAssigner = ({ cluster }: { cluster: Cluster }): Assigner => ({
  name: 'PartitionAssigner',
  version: 1,
  async assign({ members, topics }): Promise<GroupMemberAssignment[]> {
    const assignment = topics.reduce((memberAssigment, topic) => {
      const partitionMetadata = cluster.findTopicPartitionMetadata(topic);
      const partitions = partitionMetadata.map((m) => m.partitionId);
      return { ...memberAssigment, [topic]: partitions };
    }, {});

    return members.map((member) => ({
      memberId: member.memberId,
      memberAssignment: AssignerProtocol.MemberAssignment.encode({
        userData: null,
        version: this.version,
        assignment,
      }),
    }));
  },
  protocol({ topics }: { topics: string[] }): GroupState {
    return {
      name: this.name,
      metadata: AssignerProtocol.MemberMetadata.encode({
        version: this.version,
        topics,
        userData: null,
      }),
    };
  },
});
