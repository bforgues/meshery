---
layout: page
title: Overview
permalink: /overview
parent: Meshery
nav_order: 1
---
This section outlines the overview of Meshery and the Challenges that Meshery project solves. 
{: .fs-6 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## What is Meshery 
A service mesh playground to faciliate learning about functionality and performance of different service meshes. 
Meshery incorporates the collection and display of metrics from applications running in the playground. 
Meshery Provides these features below as part of it's playground. 

1. the user interface to authenticate users.
1. accepts and maintains the Kubernetes cluster config and context.
1. enables users to generate load against their applications.
1. collects the results of the performance tests from its load generator (Fortio) and stores in the cloud for historical viewing.
1. interfaces with the Meshery adapters dynamically and enables users to play with service mesh.



## What challenges does Meshery solve. (adoption and ongoing management)

Anytime performance questions are to be answered, they are subjective to the specific workload and infrastructure used for measurement. Given this challenge, the Envoy project, for example, refuses to publish performance data because such tests can be 1) involved and 2) misinterpreted.

Beyond the need for performance and overhead data under a permutation of different workloads (applications) and types and sizes of infrastructure resources, the need for cross-project, apple-to-apple comparisons are also desired in order to facilitate a comparison of behavioral differences between service meshes and selection of their use. Individual projects shy from publishing test results of other, competing service meshes. An independent, unbiased, credible analysis is needed.

Meshery is intended to be a vendor and project-neutral utility for uniformly benchmarking the performance of service meshes. 
Between service mesh and proxy projects (and surprisingly, within a single project), a number of different tools and results exist. 
Meshery allows you to pick an efficient set of tools for your ecosystem by providing performance evaluation and metrics 

1. By leveraging Meshery you could achieve apples-to-apples performance comparision of Service Meshes
1. Track your service mesh performance from release to release.
1. Understand behavioral differences between service meshes.
1. Track your application performance from version to version.



## Who Meshery is for (adopters and operators)
Targeted audience for Meshery project would be any Technology operators that leverage Service Mesh in their ecosystem; this includes Developers, Devops Engineers, Decision Makers, Architects, and organizations that rely on Microservices platform. 

## Meshery approach to provide performance Metrics around Service Meshes
- Identify permutations of workloads, infrastructure types, and measurements to use for: 
    1. Data plane testing
    1. Control plane testing.
    - Against a fixed set of:
        1. Workload(s)
        1. Infrastructure(s)

## Supported Service Meshes
Meshery currently evaluates following Service Meshes

1. Istio
1. Linkerd2
1. App Mesh
1. Consul Connect
1. SOFAmesh


## FAQ 
### Why create Meshery and not use regpatrol?
- regpatrol is not open source or available in binary form to use.
### What are some differences between regpatrol and Meshery?
-Telemetry - regpatrol sources telemetry from Mixer Prometheus adapter and uses IBM's proprietary node agent.
    - Meshery sources from Mixer Prometheus adapter and uses Prometheus node-exporter.
- Traffic type - regpatrol uses jmeter, which can parse responses and perform functional tests.
- Meshery is using fortio, which is for load-gen and perf-testing only.
### Why use Meshery?
* because its an open source, vendor neutral projects that facilitates testing across meshes.
* because fortio is not packaged into a mesh testing utility, but is only a load-generator unto its own.
* because regpatrol is closed sourcej, binary is not released, scripted for one mesh, and is produced by a vendor of that mesh.

## Link to demo video
[Service Mesh Day 2019](https://youtu.be/CFj1O_uyhhs) 




